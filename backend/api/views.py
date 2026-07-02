from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import random
from groq import Groq
from django.conf import settings
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .tokens import account_activation_token

from .models import (
    User, Chapter, Lesson, Question,
    QuizAttempt, Badge, UserBadge, StudentNote, ChapterVideo
)
from .serializers import (
    RegisterSerializer, UserSerializer, UpdateProfileSerializer,
    ChapterSerializer, LessonSerializer, QuestionSerializer,
    QuizAttemptSerializer, BadgeSerializer, UserBadgeSerializer,
    StudentNoteSerializer
)


# ============================================================
# HELPER FUNCTION — Badge check 
# ============================================================
def check_and_award_badges(user):
    def award(badge_name):
        badge = Badge.objects.filter(name=badge_name).first()
        if badge:
            UserBadge.objects.get_or_create(user=user, badge=badge)

    award('First Step')

    if QuizAttempt.objects.filter(user=user, passed=True).exists():
        award('Chapter Master')

    if QuizAttempt.objects.filter(user=user, score=10).exists():
        award('Perfect Score')

    if QuizAttempt.objects.filter(user=user, difficulty='hard', passed=True).exists():
        award('Hard Worker')

    if StudentNote.objects.filter(user=user).exists():
        award('Note Taker')

    total_chapters  = Chapter.objects.count()
    passed_chapters = QuizAttempt.objects.filter(
        user=user, passed=True
    ).values('chapter').distinct().count()
    if total_chapters > 0 and passed_chapters >= total_chapters:
        award('All Rounder')

    top3 = User.objects.order_by('-total_coins')[:3].values_list('id', flat=True)
    if user.id in list(top3):
        award('Top Scorer')


# ============================================================
# REGISTER API
# ============================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({'error': 'All fields required!'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists!'}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already registered!'}, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        user.is_active = False
        user.save()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        activation_link = f"https://mathquest-arena.vercel.app/verify-email/{uid}/{token}"

        try:
            send_mail(
                subject='Verify your MathQuest Arena Account',
                message=f'''Hello {username}!

Welcome to MathQuest Arena! 🎮

Click here to verify your email:
{activation_link}

Team MathQuest Arena''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Email send error: {str(e)}")

        return Response({
            'message': 'Registration successful! Please check your email to verify your account.'
        }, status=201)

    except Exception as e:
        print(f"Register error: {str(e)}")
        return Response({'error': 'Registration failed!'}, status=500)
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({'error': 'All fields required!'}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists!'}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already registered!'}, status=400)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        user.is_active = False
        user.save()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        activation_link = f"http://localhost:5173/verify-email/{uid}/{token}"

        send_mail(
            subject='Verify your MathQuest Arena Account',
            message=f'''Hello {username}!

Welcome to MathQuest Arena! 🎮

Click here to verify your email:
{activation_link}

Team MathQuest Arena''',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({
            'message': 'Registration successful! Please check your email to verify your account.'
        }, status=201)

    except Exception as e:
        print(f"Register error: {str(e)}")
        return Response({'error': 'Registration failed!'}, status=500)



@api_view(['GET'])
@permission_classes([AllowAny])
def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception:
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({'message': 'Email verified! You can now login.'}, status=200)
    else:
        return Response({'error': 'Invalid or expired link!'}, status=400)


# ============================================================
# LOGIN API
# ============================================================
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password required!'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)
    if user:
        check_and_award_badges(user)
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful!',
            'user'   : UserSerializer(user).data,
            'tokens' : {
                'access' : str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)

    return Response(
        {'error': 'Invalid username or password!'},
        status=status.HTTP_401_UNAUTHORIZED
    )


# ============================================================
# LOGOUT API
# ============================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(
            {'message': 'Logout successful!'},
            status=status.HTTP_200_OK
        )
    except Exception:
        return Response(
            {'error': 'Invalid token!'},
            status=status.HTTP_400_BAD_REQUEST
        )


# ============================================================
# GET PROFILE API
# ============================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    user     = request.user
    badges   = UserBadge.objects.filter(user=user)
    attempts = QuizAttempt.objects.filter(user=user)

    return Response({
        'user'          : UserSerializer(user).data,
        'badges'        : UserBadgeSerializer(badges, many=True).data,
        'total_attempts': attempts.count(),
        'total_passed'  : attempts.filter(passed=True).count(),
    }, status=status.HTTP_200_OK)


# ============================================================
# UPDATE PROFILE API
# ============================================================
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    serializer = UpdateProfileSerializer(
        request.user, data=request.data, partial=True
    )
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile updated successfully!',
            'user'   : UserSerializer(request.user).data
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# CHAPTERS LIST API
# ============================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chapters_list(request):
    chapters = Chapter.objects.all()
    return Response(
        ChapterSerializer(chapters, many=True).data,
        status=status.HTTP_200_OK
    )


# ============================================================
# CHAPTER DETAIL + LESSONS API
# ============================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chapter_detail(request, chapter_id):
    try:
        chapter = Chapter.objects.get(id=chapter_id)
    except Chapter.DoesNotExist:
        return Response(
            {'error': 'Chapter not found!'},
            status=status.HTTP_404_NOT_FOUND
        )
    lessons = Lesson.objects.filter(chapter=chapter)
    videos = ChapterVideo.objects.filter(chapter=chapter)
    return Response({
        'chapter': ChapterSerializer(chapter).data,
        'lessons': LessonSerializer(lessons, many=True).data,
        'videos': [{'id': v.id, 'title': v.title, 'video_url': v.video_url, 'order_number': v.order_number} for v in videos]
    }, status=status.HTTP_200_OK)


# ============================================================
# QUIZ QUESTIONS API
# ============================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz_questions(request, chapter_id, difficulty):
    try:
        chapter = Chapter.objects.get(id=chapter_id)
    except Chapter.DoesNotExist:
        return Response(
            {'error': 'Chapter not found!'},
            status=status.HTTP_404_NOT_FOUND
        )

    questions = list(
        Question.objects.filter(chapter=chapter, difficulty=difficulty)
    )

    if len(questions) < 10:
        return Response(
            {'error': f'Not enough questions! Only {len(questions)} available.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    random_10 = random.sample(questions, 10)
    return Response(
        QuestionSerializer(random_10, many=True).data,
        status=status.HTTP_200_OK
    )


# ============================================================
# SUBMIT QUIZ API
# ============================================================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz(request):
    chapter_id = int(request.data.get('chapter_id'))
    difficulty = request.data.get('difficulty')
    answers    = request.data.get('answers', {})

    try:
        chapter = Chapter.objects.get(id=chapter_id)
    except Chapter.DoesNotExist:
        return Response(
            {'error': 'Chapter not found!'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Score calculate 
    score        = 0
    question_ids = [int(k) for k in answers.keys()]
    questions    = Question.objects.filter(id__in=question_ids)
    results      = []

    for question in questions:
        user_answer = answers.get(str(question.id))
        is_correct  = user_answer == question.correct_answer
        if is_correct:
            score += 1
        results.append({
            'question_id'   : question.id,
            'question_text' : question.question_text,
            'your_answer'   : user_answer,
            'correct_answer': question.correct_answer,
            'is_correct'    : is_correct,
            'explanation'   : question.explanation,
        })

    # Pass/Fail
    passed       = score >= 6
    coins_earned = 0

    # Sirf final submit pe (10 answers) attempt save karo
    if len(answers) == 10:
        if passed:
            coins_earned = 10 if difficulty == 'hard' else 5
            request.user.total_coins += coins_earned
            request.user.save()

        QuizAttempt.objects.create(
            user        = request.user,
            chapter     = chapter,
            difficulty  = difficulty,
            score       = score,
            coins_earned= coins_earned,
            passed      = passed
        )
        check_and_award_badges(request.user)

    return Response({
        'score'       : score,
        'total'       : 10,
        'passed'      : passed,
        'coins_earned': coins_earned,
        'results'     : results,
    }, status=status.HTTP_200_OK)


# ============================================================
# LEADERBOARD API
# ============================================================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaderboard(request):
    top10     = User.objects.order_by('-total_coins')[:10]
    all_users = list(User.objects.order_by('-total_coins').values_list('id', flat=True))
    my_rank   = all_users.index(request.user.id) + 1

    data = []
    for rank, user in enumerate(top10, start=1):
        data.append({
            'rank'       : rank,
            'username'   : user.username,
            'total_coins': user.total_coins,
            'is_me'      : user.id == request.user.id,
        })

    return Response({
        'leaderboard': data,
        'my_rank'    : my_rank,
    }, status=status.HTTP_200_OK)


# ============================================================
# NOTES APIs
# ============================================================
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def notes_list(request):
    if request.method == 'GET':
        notes = StudentNote.objects.filter(user=request.user)
        return Response(
            StudentNoteSerializer(notes, many=True).data,
            status=status.HTTP_200_OK
        )

    if request.method == 'POST':
        serializer = StudentNoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            check_and_award_badges(request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def note_detail(request, note_id):
    try:
        note = StudentNote.objects.get(id=note_id, user=request.user)
    except StudentNote.DoesNotExist:
        return Response(
            {'error': 'Note not found!'},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'PUT':
        serializer = StudentNoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        note.delete()
        return Response(
            {'message': 'Note deleted!'},
            status=status.HTTP_204_NO_CONTENT
        )
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_tutor(request):
    try:
        user_question = request.data.get('question', '')
        if not user_question:
            return Response({'error': 'Question is required!'}, status=400)

        from groq import Groq
        client = Groq(api_key=settings.GROQ_API_KEY)
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
    "role": "system",
    "content": """You are a friendly Math tutor for Class 6 NCERT students. Your name is MathBot.
    
    IMPORTANT FORMATTING RULES:
    - Always use bullet points (•) or numbered lists
    - Break answers into clear short points
    - Use simple language
    - Max 2-3 lines per point
    - Give examples after explanation
    - Never write long paragraphs
    - Answer in English but simple words only"""
},
                {
                    "role": "user",
                    "content": user_question
                }
            ],
            model="llama-3.3-70b-versatile",
            max_tokens=1024,
        )
        
        answer = chat_completion.choices[0].message.content
        return Response({'answer': answer, 'success': True})
        
    except Exception as e:
        import traceback
        print("FULL ERROR:", traceback.format_exc())
        return Response({'error': str(e), 'success': False}, status=500)