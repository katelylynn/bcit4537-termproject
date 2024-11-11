""" Transcribes audio from .wav file using a pretrained Whisper model. """

import os
import torchaudio
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from dotenv import load_dotenv

load_dotenv()

MODEL_PATH = os.getenv("MODEL_PATH")
PRETRAINED_MODEL_PATH = os.getenv("PRETRAINED_MODEL_PATH")

def transcribe_audio(filepath):
    processor = WhisperProcessor.from_pretrained(MODEL_PATH)
    model = WhisperForConditionalGeneration.from_pretrained(PRETRAINED_MODEL_PATH)

    audio, sample_rate = torchaudio.load(filepath, format="wav")

    inputs = processor(audio.squeeze(), sampling_rate=sample_rate, return_tensors="pt")
    
    inputs['attention_mask'] = (inputs.input_features != processor.feature_extractor.padding_value).long()

    predicted_ids = model.generate(
        inputs.input_features,
        attention_mask=inputs.attention_mask,
        forced_decoder_ids=processor.get_decoder_prompt_ids(language="en")
    )
    
    transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]

    return transcription