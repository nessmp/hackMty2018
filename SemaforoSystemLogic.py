import time
import random
import serial
import sys
from random import randint
from PIL import Image
import numpy as np
import tensorflow as tf
import hack


from object_detection.utils import ops as utils_ops
from utils import label_map_util
from utils import visualization_utils as vis_util

PORT = "/dev/ttyUSB0"
# string with the path, at least bigger than 4 (number of semaphore)
path_images = ["test_images/" + full_path for full_path in [
"1.jpg", "4.jpg",  "7.jpg",       "image2.jpg",  "image9.jpg",
"2.jpg",  "5.jpg",  "8.jpg",       "image3.jpg",
"3.jpg" , "6.jpg",  "image1.jpg",  "image6.jpg",
]]

arduino = None
image = None


# Path to frozen detection graph. This is the actual model that is used for the object detection.
PATH_TO_FROZEN_GRAPH = 'faster_rcnn_resnet101_kitti_2018_01_28/frozen_inference_graph.pb'


detection_graph = tf.Graph()
with detection_graph.as_default():
  od_graph_def = tf.GraphDef()
  with tf.gfile.GFile(PATH_TO_FROZEN_GRAPH, 'rb') as fid:
    serialized_graph = fid.read()
    od_graph_def.ParseFromString(serialized_graph)
    tf.import_graph_def(od_graph_def, name='')


def load_image_into_numpy_array(image):
  (im_width, im_height) = image.size
  return np.array(image.getdata()).reshape(
      (im_height, im_width, 3)).astype(np.uint8)

def run_inference_for_single_image(image, graph):
  with graph.as_default():
    with tf.Session() as sess:
      # Get handles to input and output tensors
      ops = tf.get_default_graph().get_operations()
      all_tensor_names = {output.name for op in ops for output in op.outputs}
      tensor_dict = {}
      for key in ['num_detections']:
        tensor_name = key + ':0'
        if tensor_name in all_tensor_names:
          tensor_dict[key] = tf.get_default_graph().get_tensor_by_name(
              tensor_name)
      image_tensor = tf.get_default_graph().get_tensor_by_name('image_tensor:0')

      # Run inference
      output_dict = sess.run(tensor_dict,
                             feed_dict={image_tensor: np.expand_dims(image, 0)})

      # all outputs are float32 numpy arrays, so convert types as appropriate
      output_dict['num_detections'] = int(output_dict['num_detections'][0])
  return output_dict['num_detections']

def getNumberOfCars(image):
  (im_width, im_height) = image.size
  image_np = np.array(image.getdata()).reshape(
      (im_height, im_width, 3)).astype(np.uint8)
  image_np_expanded = np.expand_dims(image_np, axis=0)
  num_of_cars = run_inference_for_single_image(image_np, detection_graph)
  print(num_of_cars)
  return num_of_cars



def _send_a_char(c):
	# Encode: https://stackoverflow.com/questions/35642855/python3-pyserial-typeerror-unicode-strings-are-not-supported-please-encode-to
	arduino.write(c.encode())

"""
	str_semaphore: a iteratable with the char
"""
def send_semaphore(str_semaphore):
	for light in str_semaphore:
		_send_a_char(light)


def compute_next_images(number_semaphore):
	index_paths = []
	for each in range(number_semaphore):
		index_path = randint(0, len(path_images) - 1)
		while index_path in index_paths:
			index_path = randint(0, len(path_images) - 1)
		
		index_paths.append(index_path)

	return [Image.open(path_images[index_path]) for index_path in index_paths]

def show_images(images):
	for img in images:
		img.show()

	time.sleep(10)


def setSemaforos(lastRoundB):
	print("--------------Next Round---------------------")
	tiempoPorLinea = 1.5
	semaforos = [0,1,2,3]

	images_cars = compute_next_images(len(semaforos))
	# show_images(images_cars)

	# numberOfCars = [getNumberOfCars(img) for img in images_cars]
	numberOfCars = []	
	output_dicts = [hack.run_inference_for_single_image(img) for img in images_cars]
	x = 0
	for output_dict in output_dicts:
		image_np = load_image_into_numpy_array(images_cars[x])
		vis_util.visualize_boxes_and_labels_on_image_array(
		image_np,
		output_dict['detection_boxes'],
		output_dict['detection_classes'],
		output_dict['detection_scores'],
		{1: {'id': 1, 'name': 'car'}},
		instance_masks=output_dict.get('detection_masks'),
		use_normalized_coordinates=True,
		line_thickness=1)
		#plt.figure(figsize=IMAGE_SIZE)
		im = Image.fromarray(image_np)
		im.show()
		numberOfCars.append(output_dict['num_detections'])
		x += 1

	totalNumber = []
	print("Numeros totales")
	for i in range (0,len(numberOfCars)-2):
		#print "Index ",i, i+2
		print(numberOfCars[i]+numberOfCars[i+2])
		totalNumber.append(numberOfCars[i]+numberOfCars[i+2])

	carsInA= totalNumber[0]
	carsInB= totalNumber[1]
	impr = ""
	if(lastRoundB or carsInB==0):
		lastRoundB = False
		print("---Prendo Semaforo A----")
		send_semaphore("RARA")
		time.sleep(2.00)
		send_semaphore("VRVR")

		print("Me espero")
		print(carsInA*tiempoPorLinea, "seg")
		tiempoEspera  = (carsInA*tiempoPorLinea)
		tInit = time.time()
		tElapsed = 0
		while(tElapsed<tiempoEspera ):#and numberOfCars(semaforos[0]) + numberOfCars(semaforos[2])>0):
			if arduino.inWaiting() > 0:
				receive = arduino.read()
				if receive == b"\n":
					print(impr)
					impr = ""
				else:
					impr += receive.decode("utf-8")
			else:
				time.sleep(1)
			tElapsed = time.time()- tInit

		return False
	else:
		print("---Prendo Semaforo B----")
		send_semaphore("ARAR")
		time.sleep(2.000)
		send_semaphore("RVRV")

		print("Me espero")
		print(carsInB*tiempoPorLinea, "seg")
		tiempoEspera  = (carsInB*tiempoPorLinea)
		tInit = time.time()
		tElapsed = 0
		while(tElapsed<tiempoEspera):# and numberOfCars(semaforos[1]) + numberOfCars(semaforos[3])>0):
			if arduino.inWaiting() > 0:
				receive = arduino.read()
				if receive == b"\n":
					print(impr)
					impr = ""
				else:
					impr += receive.decode("utf-8")
			else:
				time.sleep(1)
			tElapsed = time.time()- tInit
		return True

lastRoundB = False

#---------Initializer-----------------------
def init():
	try:
		global arduino
		arduino = serial.Serial(PORT, 9600, timeout = 1)
		time.sleep(3)
		return True
	except serial.SerialException:
		print("No me conecte")
		return False

#--------------------Main----------------------------------------
if (init()):
	print("Se pudo")
else:
	print("No se pudo")
	while(1):
		pass

while(True):
	lastRoundB = setSemaforos(lastRoundB)
