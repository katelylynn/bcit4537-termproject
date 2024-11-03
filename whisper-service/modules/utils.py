import torchaudio
from transformers import WhisperProcessor, WhisperForConditionalGeneration

processor = WhisperProcessor.from_pretrained("./models/whisper_tiny_model")
model = WhisperForConditionalGeneration.from_pretrained(
    "./models/whisper_tiny_model/models--openai--whisper-tiny/snapshots/169d4a4341b33bc18d8881c4b69c2e104e1cc0af"
)

def transcribe_audio(filepath):
    # Load and process the audio file
    audio, sample_rate = torchaudio.load(filepath)
    inputs = processor(audio.squeeze(), sampling_rate=sample_rate, return_tensors="pt")
    inputs['attention_mask'] = (inputs.input_features != processor.feature_extractor.padding_value).long()

    # Generate transcription
    predicted_ids = model.generate(
        inputs.input_features,
        attention_mask=inputs.attention_mask,
        forced_decoder_ids=processor.get_decoder_prompt_ids(language="en")
    )
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
    return transcription
