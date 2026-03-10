#!/usr/bin/env python
import os
import sys
from pathlib import Path


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[1]
    if str(root) not in sys.path:
        sys.path.append(str(root))

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
