""" Handles transcription-related requests. """
""" This code was made with the assistance of CHATGPT version 4o- to:
 - make recommendations
 - provide feedback
 - correct syntax and logic
 """

from flask import jsonify, make_response
from modules.transcribe_audio import transcribe_audio
from lang.en import Messages, MessageKeys
from modules.temporary_file_handler import save_temp_file, delete_temp_file

def handle_transcription_request(request):
    if 'file' not in request.files:
        return jsonify({"error": Messages.get(MessageKeys.NO_FILE_ERROR)}), 400

    file = request.files['file']
    temp_filepath = save_temp_file(file)    

    try:
        transcription = transcribe_audio(temp_filepath)
    finally:
        delete_temp_file(temp_filepath)

    response = make_response(jsonify({"transcription": transcription}), 200)
    response.headers['Content-Type'] = 'application/json'
    return response
