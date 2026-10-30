import subprocess
import re

# Get origin/main index.html
origin_html = subprocess.check_output(['git', 'show', 'origin/main:index.html'], text=True, encoding='utf-8')
with open('index.html', 'r', encoding='utf-8') as f:
    curr_html = f.read()

# Check all IDs in origin/main
origin_ids = set(re.findall(r'id=["\']([^"\']+)["\']', origin_html))
curr_ids = set(re.findall(r'id=["\']([^"\']+)["\']', curr_html))

print("=== IDS MISSING IN CURRENT HTML ===")
missing_ids = origin_ids - curr_ids
for i in sorted(missing_ids):
    print(f"  Missing ID: {i}")

# Check all data- attributes
origin_data = set(re.findall(r'(data-[a-zA-Z0-9\-]+)=["\']([^"\']+)["\']', origin_html))
curr_data = set(re.findall(r'(data-[a-zA-Z0-9\-]+)=["\']([^"\']+)["\']', curr_html))
missing_data = origin_data - curr_data
print("\n=== DATA ATTRIBUTES MISSING IN CURRENT HTML ===")
for attr, val in sorted(missing_data):
    print(f"  Missing: {attr}='{val}'")

# Check all scripts included in origin/main vs current
origin_scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', origin_html)
curr_scripts = re.findall(r'<script[^>]*src=["\']([^"\']+)["\']', curr_html)
print("\n=== SCRIPTS ===")
print("Origin scripts:", origin_scripts)
print("Current scripts:", curr_scripts)
