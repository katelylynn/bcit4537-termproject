import torchaudio
from transformers import WhisperProcessor, WhisperForConditionalGeneration

VALID_COMMANDS = {
    "forward": "/forward",
    "backward": "/backward",
    "stop": "/stop",
    "rotate left": "/rotate",
    "rotate right": "/rotate"
}

def transcribe_audio(filepath):
    # Load model and processor each time for consistency with the standalone script
    processor = WhisperProcessor.from_pretrained("./models/whisper_tiny_model")
    model = WhisperForConditionalGeneration.from_pretrained(
        "./models/whisper_tiny_model/models--openai--whisper-tiny/snapshots/169d4a4341b33bc18d8881c4b69c2e104e1cc0af"
    )

    # Load the audio file
    audio, sample_rate = torchaudio.load(filepath, format="wav")

    # Debugging information to verify file details
    print(f"Audio file details - Sample Rate: {sample_rate}, Channels: {audio.shape[0]}, Frame Count: {audio.shape[1]}")
    
    # Check if sample rate and channels match expected values
    if sample_rate != 16000 or audio.shape[0] != 1:
        print("Warning: Audio file does not match expected format. Resampling or converting channels may be necessary.")
    
    # Process the audio for the Whisper model
    inputs = processor(audio.squeeze(), sampling_rate=sample_rate, return_tensors="pt")
    
    # Add attention mask
    inputs['attention_mask'] = (inputs.input_features != processor.feature_extractor.padding_value).long()

    # Generate transcription
    predicted_ids = model.generate(
        inputs.input_features,
        attention_mask=inputs.attention_mask,
        forced_decoder_ids=processor.get_decoder_prompt_ids(language="en")
    )
    
    # Decode the transcription
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

    return transcription

def validate_command(transcription):
    """Validate if the transcription is a recognized command."""
    command = VALID_COMMANDS.get(transcription.lower())
    if command:
        return command
    return None