from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('register/', views.register, name='register'),
    path('login/',    views.login,    name='login'),
    path('logout/',   views.logout,   name='logout'),
    path('verify-email/<uidb64>/<token>/', views.verify_email),

    # Profile
    path('profile/',                views.get_profile,    name='get_profile'),
    path('profile/update/',         views.update_profile, name='update_profile'),

    # Chapters + Lessons
    path('chapters/',                   views.chapters_list,  name='chapters_list'),
    path('chapters/<int:chapter_id>/',  views.chapter_detail, name='chapter_detail'),

    # Quiz
    path('quiz/<int:chapter_id>/<str:difficulty>/', views.get_quiz_questions, name='get_quiz_questions'),
    path('quiz/submit/',                            views.submit_quiz,        name='submit_quiz'),

    # Leaderboard
    path('leaderboard/', views.leaderboard, name='leaderboard'),

    # Notes
    path('notes/',               views.notes_list,  name='notes_list'),
    path('notes/<int:note_id>/', views.note_detail, name='note_detail'),

    #ai url
    path('ai-tutor/', views.ai_tutor),
]