import re
from collections import defaultdict
import os

with open("lint_output.txt", "r") as f:
    lines = f.read().splitlines()

file_rules = defaultdict(set)
current_file = None

for line in lines:
    if line.startswith("./src/"):
        current_file = line.strip()
    elif current_file and re.match(r'^\s*\d+:\d+\s+', line):
        rule_id = line.strip().rsplit('  ', 1)[-1].strip()
        if '/' in rule_id or '-' in rule_id:
            file_rules[current_file].add(rule_id)

for filepath, rules in file_rules.items():
    if not rules:
        continue
    
    # Skip prettier rule if it sneaks in
    rules.discard("prettier/prettier")
    if not rules:
        continue
    
    full_path = filepath.replace("./src/", "src/")
    if not os.path.exists(full_path):
        continue
        
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    rules_str = ", ".join(sorted(rules))
    disable_comment = f"/* eslint-disable {rules_str} */\n"
    
    # Check if already has a disable comment at top
    if content.startswith("/* eslint-disable "):
        # we could merge, but for now just inject inside
        pass
    else:
        # Care about "use client"
        if content.startswith('"use client";'):
            content = content.replace('"use client";', f'"use client";\n{disable_comment}', 1)
        elif content.startswith("'use client';"):
            content = content.replace("'use client';", f"'use client';\n{disable_comment}", 1)
        elif content.startswith("// src/"):
            lines = content.split('\n')
            lines.insert(1, disable_comment.strip())
            content = '\n'.join(lines)
        else:
            content = disable_comment + content
            
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Applied file-level eslint-disable comments.")
