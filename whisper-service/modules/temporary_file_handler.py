""" Handles temporary audio file storage and cleanup. """

import tempfile
import os

def save_temp_file(file, suffix=".wav"):
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_filepath = temp_file.name
        file.save(temp_filepath)
    return temp_filepath

def delete_temp_file(filepath):
    if os.path.exists(filepath):
        os.remove(filepath)
