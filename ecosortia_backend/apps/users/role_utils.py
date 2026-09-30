def is_main_admin(user):
    return user.is_authenticated and user.is_superuser


def is_municipality_admin(user):
    return (
        user.is_authenticated
        and user.is_staff
        and not user.is_superuser
        and user.groups.filter(name="Municipality Admin").exists()
    )


def is_municipality_staff(user):
    return (
        user.is_authenticated
        and user.is_staff
        and not user.is_superuser
        and user.groups.filter(name="Municipality Staff").exists()
    )