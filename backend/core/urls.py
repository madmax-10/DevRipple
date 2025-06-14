from django.urls import path
from core.views import promptTemplate,aiResponse

urlpatterns = [
    path('template/', promptTemplate.as_view(), name='template'),
    path('chat/', aiResponse.as_view(), name='ai-response'),
]