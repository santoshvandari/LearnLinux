from django.urls import path
from terminal import views
urlpatterns = [
    path('query/',views.TerminalView.as_view(),name="terminal_query"),
]
