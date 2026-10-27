import os

output_file = "project_code.txt"
extensions = ('.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.json', '.py', '.php', '.md', '.txt')
exclude_dirs = {'node_modules', '.git', 'venv', '__pycache__', 'dist', 'build'}

with open(output_file, 'w', encoding='utf-8') as outfile:
    outfile.write("=== START OF PROJECT ===\n")
    
    for root, dirs, files in os.walk('.'):
        # حذف پوشه‌های غیرضروری
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            if file.endswith(extensions) and file != output_file and file != 'collect.py':
                filepath = os.path.join(root, file)
                outfile.write(f"\n\n=========================================\n")
                outfile.write(f"FILE: {filepath}\n")
                outfile.write(f"=========================================\n")
                try:
                    with open(filepath, 'r', encoding='utf-8') as infile:
                        outfile.write(infile.read())
                except Exception as e:
                    outfile.write(f"[Error reading file: {e}]\n")
                    
    outfile.write("\n\n=== END OF PROJECT ===\n")

print("✅ تمام فایل‌ها با موفقیت در project_code.txt ذخیره شدند!")