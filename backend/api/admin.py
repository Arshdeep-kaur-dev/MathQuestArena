from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Chapter, Lesson, Question,
    QuizAttempt, Badge, UserBadge, StudentNote, ChapterVideo
)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display      = ('username', 'email', 'total_coins', 'is_admin', 'created_at')
    list_filter       = ('is_admin', 'is_active')
    search_fields     = ('username', 'email')
    ordering          = ('-created_at',)
    filter_horizontal = ()

    fieldsets = (
        (None,          {'fields': ('username', 'email', 'password')}),
        ('Game Stats',  {'fields': ('total_coins',)}),
        ('Permissions', {'fields': ('is_active', 'is_admin')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields':  ('username', 'email', 'password1', 'password2'),
        }),
    )

@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'title')
    ordering     = ('order_number',)

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('chapter', 'title', 'order_number')
    list_filter  = ('chapter',)

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display  = ('chapter', 'difficulty', 'question_text')
    list_filter   = ('chapter', 'difficulty')
    search_fields = ('question_text',)

@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'chapter', 'difficulty', 'score', 'passed', 'coins_earned')
    list_filter  = ('difficulty', 'passed')

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'earned_at')

@admin.register(StudentNote)
class StudentNoteAdmin(admin.ModelAdmin):
    list_display = ('user', 'last_updated')

admin.site.register(ChapterVideo)