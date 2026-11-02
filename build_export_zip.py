import os
import zipfile

def create_zip():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    public_dir = os.path.join(root_dir, 'public')
    os.makedirs(public_dir, exist_ok=True)
    zip_path = os.path.join(public_dir, 'fixa-gaming-complete-website.zip')

    ignored_dirs = {'node_modules', '.git', 'dist', '.cache'}
    ignored_files = {'fixa-gaming-complete-website.zip', 'bun.lock', '.DS_Store'}

    include_extensions = {
        '.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css', '.svg', '.png', '.jpg', '.jpeg', '.md', '.example'
    }

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in ignored_dirs and not d.startswith('.')]
            for file in files:
                if file in ignored_files or file.startswith('.'):
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir)
                zipf.write(file_path, os.path.join('fixa-gaming', rel_path))

    file_size_kb = os.path.getsize(zip_path) / 1024
    print(f"ZIP created successfully: {zip_path} ({file_size_kb:.2f} KB)")

if __name__ == '__main__':
    create_zip()
