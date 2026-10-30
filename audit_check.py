import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('assets/css/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open('assets/css/fonts.css', 'r', encoding='utf-8') as f:
    fonts = f.read()

with open('assets/js/card-detail.js', 'r', encoding='utf-8') as f:
    card_js = f.read()

with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    main_js = f.read()

print('=== 1. CHECKING PROHIBITED FONTS ===')
forbidden_fonts = [
    'Cinzel', 'Cormorant', 'Playfair', 'Instrument Serif', 
    'Fraunces', 'DM Serif', 'Inter', 'Space Grotesk', 
    'Plus Jakarta Sans', 'monospace', 'Courier', 'Fira Code', 'JetBrains'
]
for font in forbidden_fonts:
    for name, content in [('index.html', html), ('styles.css', css), ('fonts.css', fonts)]:
        matches = re.findall(rf'\b{font}\b', content, re.IGNORECASE)
        if matches:
            print(f'Found {font} in {name}: {len(matches)} times')

print('=== 2. CHECKING EM DASH ===')
for name, content in [('index.html', html), ('styles.css', css), ('card-detail.js', card_js), ('main.js', main_js)]:
    matches = re.findall(r'—', content)
    if matches:
        print(f'Found em-dash (—) in {name}: {len(matches)} times')

print('=== 3. CHECKING PROHIBITED BUZZWORDS ===')
buzzwords = [
    'bukan sekadar', 'bukan hanya', 'melainkan', 'adiluhung', 'transendental', 
    'kosmis', 'mahakarya', 'keabadian', 'titik nol', 'sentinel', 'benteng', 
    'entitas', 'dialektika', 'korespondensi kuratorial', 'bernyawa', 'bernapas', 
    'menyimpan makna', 'denyut', 'melintasi peradaban'
]
for b in buzzwords:
    for name, content in [('index.html', html), ('card-detail.js', card_js), ('main.js', main_js)]:
        matches = re.findall(rf'\b{b}\b', content, re.IGNORECASE)
        if matches:
            print(f'Found buzzword "{b}" in {name}: {len(matches)} times')

print('=== 4. CHECKING HREF="#" ===')
matches = [m.start() for m in re.finditer(r'href\s*=\s*["\']#["\']', html)]
print(f'Found href="#" in index.html: {len(matches)}')
for line_no, line in enumerate(html.splitlines(), 1):
    if 'href="#"' in line or "href='#'" in line:
        print(f'  Line {line_no}: {line.strip()[:100]}')

print('=== 5. CHECKING !IMPORTANT IN STYLES.CSS ===')
matches = re.findall(r'!important', css)
print(f'Found !important in styles.css: {len(matches)}')

print('=== 6. CHECKING STYLE TAGS IN HTML ===')
style_tags = re.findall(r'<style\b[^>]*>([\s\S]*?)<\/style>', html, re.IGNORECASE)
print(f'Found <style> tags in index.html: {len(style_tags)}')
for st in style_tags:
    print('  Style content snippet:', st.strip()[:100])

print('=== 7. CHECKING DIAMONDS / ORNAMENTS ===')
diamonds = re.findall(r'[◆◇◈✦✧]', html)
print(f'Found diamond/star ornaments in index.html: {len(diamonds)}')

print('=== 8. CHECKING GRADIENTS / GLOW / BACKDROP-FILTER IN CSS ===')
gradients = re.findall(r'(linear-gradient|radial-gradient|conic-gradient)', css, re.IGNORECASE)
print(f'Found gradients in styles.css: {len(gradients)}')
glows = re.findall(r'box-shadow:[^;]*(rgba?\([^)]+\)|#[0-9a-fA-F]+)[^;]*;', css)
print(f'Found box-shadows in styles.css: {len(glows)}')
backdrop = re.findall(r'backdrop-filter', css, re.IGNORECASE)
print(f'Found backdrop-filter in styles.css: {len(backdrop)}')
text_shadow = re.findall(r'text-shadow', css, re.IGNORECASE)
print(f'Found text-shadow in styles.css: {len(text_shadow)}')
