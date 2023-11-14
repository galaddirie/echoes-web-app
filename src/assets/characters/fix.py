import os

files = os.listdir(".")
for filename in files:
    file_wo_ext, file_ext = os.path.splitext(filename)
    if file_ext == ".PNG":
        newfile = file_wo_ext + ".png"
        os.rename(filename, newfile)