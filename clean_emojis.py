#!/usr/bin/env python3
import re
import os

def remove_emojis(text):
    # Comprehensive emoji removal pattern
    emoji_pattern = re.compile(
        '['
        '\U0001F1E0-\U0001F1FF'  # flags (iOS)
        '\U0001F300-\U0001F5FF'  # symbols & pictographs
        '\U0001F600-\U0001F64F'  # emoticons
        '\U0001F680-\U0001F6FF'  # transport & map symbols
        '\U0001F700-\U0001F77F'  # alchemical symbols
        '\U0001F780-\U0001F7FF'  # Geometric Shapes Extended
        '\U0001F800-\U0001F8FF'  # Supplemental Arrows-C
        '\U0001F900-\U0001F9FF'  # Supplemental Symbols and Pictographs
        '\U0001FA00-\U0001FA6F'  # Chess Symbols
        '\U0001FA70-\U0001FAFF'  # Symbols and Pictographs Extended-A
        '\U00002702-\U000027B0'  # Dingbats
        '\U000024C2-\U0001F251'
        ']+', flags=re.UNICODE)
    
    return emoji_pattern.sub('', text)

# List of documentation files to clean
files = [
    'AFAS_MVP_COMPLETION_PLAN.md',
    'API_DOCUMENTATION.md', 
    'CHANGELOG.md',
    'USER_HANDBOOK.md',
    'DOCUMENTATION_SUMMARY.md',
    'ISAF_RESULTS_EXPLANATION.md',
    'README.md',
    'DOCUMENTATION.md',
    'FIXES_COMPLETED.md',
    'ISAF_Complete_Analysis_Report.md'
]

print("Starting comprehensive emoji cleanup...")

for filename in files:
    if os.path.exists(filename):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            cleaned_content = remove_emojis(content)
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(cleaned_content)
            
            print(f'✓ Cleaned {filename}')
        except Exception as e:
            print(f'✗ Error cleaning {filename}: {e}')
    else:
        print(f'✗ File not found: {filename}')

print("Emoji cleanup completed!") 