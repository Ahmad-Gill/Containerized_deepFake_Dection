from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .models import UploadedImage
from keras.models import load_model
from keras.preprocessing.image import load_img, img_to_array
import numpy as np
import os

# Load model once at startup
model_path = os.path.join(settings.BASE_DIR, 'model', 'xception_deepfake_model.h5')
model = load_model(model_path)

def preprocess_image(image_path):
    img = load_img(image_path, target_size=(299, 299))
    img_array = img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@api_view(['POST'])
def predict_image(request):
    image_file = request.FILES.get('image')

    if not image_file:
        return Response({'error': 'No image uploaded'}, status=400)

    # Save uploaded image to media/uploads/
    uploaded = UploadedImage.objects.create(image=image_file)
    full_path = os.path.join(settings.MEDIA_ROOT, uploaded.image.name)

    try:
        img_array = preprocess_image(full_path)
        prediction = model.predict(img_array)
        label = "Real" if prediction[0][0] > prediction[0][1] else "Fake"

        return Response({
            'prediction': label,
            'confidence': {
                'real': float(prediction[0][0]),
                'fake': float(prediction[0][1])
            }
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)
