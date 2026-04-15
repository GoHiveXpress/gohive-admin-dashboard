import os

def walk_dir(path):
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                yield os.path.join(root, file)

for filepath in walk_dir('/Users/user/Desktop/gohive-admin/src'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '/* eslint-disable ' in content and '/* eslint-enable' not in content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content.rstrip() + '\n\n/* eslint-enable */\n')
        print(f"Added eslint-enable to {filepath}")

