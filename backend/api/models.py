from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# ============================================================
# USER MODEL
# ============================================================
class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        user = self.model(
            username=username,
            email=self.normalize_email(email)
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None):
        user = self.create_user(username, email, password)
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    username    = models.CharField(max_length=50, unique=True)
    email       = models.EmailField(unique=True)
    total_coins = models.IntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)
    is_active   = models.BooleanField(default=True)
    is_admin    = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD  = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

    @property
    def is_staff(self):
        return self.is_admin

    
    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin


# ============================================================
# CHAPTER MODEL
# Ye NCERT Class 6 Math ki chapters store karega
# Jaise: "Knowing Our Numbers", "Whole Numbers" etc.
# order_number se chapters sequence mein dikhenge
# ============================================================
class Chapter(models.Model):
    title        = models.CharField(max_length=200)
    description  = models.TextField()
    order_number = models.IntegerField(unique=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order_number']


# ============================================================
# LESSON MODEL
# Har chapter ke 2 lessons honge:
# 1. Video lesson (video_url)
# 2. Reading lesson (text_content)
# chapter = FK → matlab ye lesson kis chapter ka hai
# ============================================================
class Lesson(models.Model):
    chapter      = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='lessons')
    title        = models.CharField(max_length=200)
    video_url    = models.URLField(blank=True, null=True)
    text_content = models.TextField(blank=True, null=True)
    order_number = models.IntegerField()

    def __str__(self):
        return f"{self.chapter.title} - {self.title}"

    class Meta:
        ordering = ['order_number']


# ============================================================
# QUESTION MODEL
# Quiz ke MCQ questions yahan store honge
# difficulty = 'easy' ya 'hard'
# correct_answer = 'A', 'B', 'C', ya 'D'
# explanation = wrong answer pe ye dikhega
# ============================================================
class Question(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('hard', 'Hard'),
    ]
    ANSWER_CHOICES = [
        ('A', 'A'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
    ]

    chapter        = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='questions')
    question_text  = models.TextField()
    option_a       = models.CharField(max_length=300)
    option_b       = models.CharField(max_length=300)
    option_c       = models.CharField(max_length=300)
    option_d       = models.CharField(max_length=300)
    correct_answer = models.CharField(max_length=1, choices=ANSWER_CHOICES)
    difficulty     = models.CharField(max_length=4, choices=DIFFICULTY_CHOICES)
    explanation    = models.TextField()

    def __str__(self):
        return f"{self.chapter.title} - {self.difficulty} - {self.question_text[:50]}"


# ============================================================
# QUIZ ATTEMPT MODEL
# Jab bhi koi student quiz dega, ek record yahan banega
# score = kitne sahi jawab diye (max 10)
# passed = 6 ya usse zyada = pass
# coins_earned = pass kiya toh 5 ya 10 coins
# ============================================================
class QuizAttempt(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('hard', 'Hard'),
    ]

    user         = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    chapter      = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='quiz_attempts')
    difficulty   = models.CharField(max_length=4, choices=DIFFICULTY_CHOICES)
    score        = models.IntegerField()
    coins_earned = models.IntegerField(default=0)
    passed       = models.BooleanField(default=False)
    attempted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.chapter.title} - {self.difficulty} - {self.score}/10"


# ============================================================
# BADGE MODEL
# 7 badges hain project mein
# criteria = badge unlock hone ki condition (text description)
# ============================================================
class Badge(models.Model):
    name        = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    criteria    = models.TextField()

    def __str__(self):
        return self.name


# ============================================================
# USER BADGE MODEL
# Kaunse user ne kaunsa badge earn kiya — ye track karta hai
# user + badge dono unique saath mein (ek badge ek baar hi milega)
# ============================================================
class UserBadge(models.Model):
    user      = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_badges')
    badge     = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='user_badges')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"


# ============================================================
# STUDENT NOTE MODEL
# ============================================================
class StudentNote(models.Model):
    user         = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    notes        = models.TextField()
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - Note {self.id}"

class ChapterVideo(models.Model):
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=200)
    video_url = models.URLField()
    order_number = models.IntegerField(default=1)

    class Meta:
        ordering = ['order_number']

    def __str__(self):
        return f"{self.chapter.title} - {self.title}"