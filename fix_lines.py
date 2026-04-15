import os

def walk_dir(path):
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                yield os.path.join(root, file)

for filepath in walk_dir('/Users/user/Desktop/gohive-admin/src'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace "use client";\n/* eslint-disable with "use client";\n\n/* eslint-disable
    new_content = content.replace('"use client";\n/*', '"use client";\n\n/*')
    if "eslint-comments/no-unused-enable" in content or "eslint-comments/no-unused-disable" in content:
        if "form.tsx" in filepath:
             # special fix for form.tsx unused disable/enable
             new_content = new_content.replace('/* eslint-enable */', '')
             if '/* eslint-disable \n' in new_content:
                 new_content = new_content.replace('/* eslint-disable \n', '')

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

