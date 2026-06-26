from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, Chapter, Lesson, Question, Badge, UserBadge, StudentNote, QuizAttempt


# ============================================================
# REGISTER SERIALIZER
# Naya user banane ke liye
# password confirm check karta hai
# ============================================================
class RegisterSerializer(serializers.ModelSerializer):
    password         = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['username', 'email', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match!")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data['password'] = make_password(validated_data['password'])
        return User.objects.create(**validated_data)


# ============================================================
# USER SERIALIZER
# Login ke baad user ki info return karne ke liye
# password field nahi bhejenge — security!
# ============================================================
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'total_coins', 'created_at']


# ============================================================
# UPDATE PROFILE SERIALIZER
# Sirf name aur password update hoga — email nahi
# ============================================================
class UpdateProfileSerializer(serializers.ModelSerializer):
    new_password     = serializers.CharField(write_only=True, required=False, min_length=6, allow_blank=True)
    confirm_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    username         = serializers.CharField(required=False)

    class Meta:
        model  = User
        fields = ['username', 'new_password', 'confirm_password']

    def validate(self, data):
        new_password     = data.get('new_password', '').strip()
        confirm_password = data.get('confirm_password', '').strip()

        if new_password or confirm_password:
            if new_password != confirm_password:
                raise serializers.ValidationError("Passwords do not match!")
            if len(new_password) < 6:
                raise serializers.ValidationError("Password must be at least 6 characters!")
        return data

    def update(self, instance, validated_data):
        validated_data.pop('confirm_password', None)
        new_password = validated_data.pop('new_password', '').strip()

        if new_password:
            instance.password = make_password(new_password)

        instance.username = validated_data.get('username', instance.username)
        instance.save()
        return instance


# ============================================================
# CHAPTER SERIALIZER
# Chapters list React ko bhejne ke liye
# ============================================================
class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Chapter
        fields = ['id', 'title', 'description', 'order_number']


# ============================================================
# LESSON SERIALIZER
# Chapter ke lessons React ko bhejne ke liye
# ============================================================
class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Lesson  # ← SAHI
        fields = ['id', 'title', 'video_url', 'text_content', 'order_number']


# ============================================================
# QUESTION SERIALIZER
# Quiz ke questions React ko bhejne ke liye
# correct_answer nahi bhejenge — cheating rokne ke liye!
# ============================================================
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Question
        fields = [
            'id', 'question_text',
            'option_a', 'option_b', 'option_c', 'option_d',
            'difficulty'
        ]


# ============================================================
# QUIZ ATTEMPT SERIALIZER
# Quiz submit karne ke baad result save karne ke liye
# ============================================================
class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model  = QuizAttempt
        fields = ['id', 'chapter', 'difficulty', 'score', 'coins_earned', 'passed', 'attempted_at']


# ============================================================
# BADGE SERIALIZER
# User ke badges profile pe dikhane ke liye
# ============================================================
class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Badge
        fields = ['id', 'name', 'description', 'criteria']


# ============================================================
# USER BADGE SERIALIZER
# Kaunsa badge kab mila — profile pe dikhega
# ============================================================
class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model  = UserBadge
        fields = ['id', 'badge', 'earned_at']


# ============================================================
# STUDENT NOTE SERIALIZER
# Notes create/edit/delete ke liye
# ============================================================
class StudentNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = StudentNote
        fields = ['id', 'notes', 'last_updated']