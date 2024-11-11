from enum import Enum

class MessageKeys(Enum):
    NO_FILE_ERROR = "no_file_error"
    UNEXPECTED_ERROR = "unexpected_error"
    TRANSCRIPTION_SUCCESS = "transcription_success"

class Messages:
    _MESSAGES = {
        MessageKeys.NO_FILE_ERROR.value: "No file uploaded",
        MessageKeys.UNEXPECTED_ERROR.value: "An unexpected error occurred.",
        MessageKeys.TRANSCRIPTION_SUCCESS.value: "Transcription successful"
    }

    @classmethod
    def get(cls, key: MessageKeys, default: str = "Message not found") -> str:
        return cls._MESSAGES.get(key.value, default)
