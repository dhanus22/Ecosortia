from django.http import JsonResponse


def index(request):
    return JsonResponse({
        'app': 'credits',
        'status': 'ok',
    })
