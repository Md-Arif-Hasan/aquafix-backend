from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2
import base64
import datetime
import numpy as np
from LabStretching import LABStretching
from color_equalisation import RGB_equalisation
from global_stretching_RGB import stretching
from relativeglobalhistogramstretching import RelativeGHstretching

# Import your restoration-related functions
from IBLA_CloseDepth import closePoint
import mysql.connector

from IBLA_F_stretching import StretchingFusion
from IBLA_MapFusion import Scene_depth
from IBLA_MapOne import max_R
from IBLA_MapTwo import R_minus_GB
from IBLA_blurrinessMap import blurrnessMap
from IBLA_getAtomsphericLightFusion import ThreeAtomsphericLightFusion
from IBLA_getAtomsphericLightOne import getAtomsphericLightDCP_Bright
from IBLA_getAtomsphericLightThree import getAtomsphericLightLb
from IBLA_getAtomsphericLightTwo import getAtomsphericLightLv
from IBLA_getRGbDarkChannel import getRGB_Darkchannel
from IBLA_getRefinedTransmission import Refinedtransmission
from IBLA_getTransmissionGB import getGBTransmissionESt
from IBLA_getTransmissionR import getTransmission
from IBLA_global_Stretching import global_stretching
from IBLA_sceneRadiance import sceneRadianceRGB
from IBLA_sceneRadianceHE import RecoverHE




from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2
from mysql.connector import Error

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'upload'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# MySQL Configuration
mysql_config = {
    'host': 'localhost','database': 'aquafix','user': 'root', 'password': '','autocommit': True,
}

def execute_query(query, values=None):
    try:
        connection = mysql.connector.connect(**mysql_config)
        cursor = connection.cursor()
        if values:
            cursor.execute(query, values)
        else:
            cursor.execute(query)
        return cursor.fetchall()
    except Error as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        connection.close()

# Create MySQL Tables
create_enhance_table_query = """ CREATE TABLE IF NOT EXISTS enhance ( id INT AUTO_INCREMENT PRIMARY KEY, file_path VARCHAR(255),processed_image_path VARCHAR(255))"""

create_restore_table_query = """ CREATE TABLE IF NOT EXISTS restore (id INT AUTO_INCREMENT PRIMARY KEY,file_path VARCHAR(255),restored_image_path VARCHAR(255))"""

execute_query(create_enhance_table_query)
# execute_query(create_restore_table_query)

# Store file paths in MySQL tables
def store_enhance_file_paths(file_path, processed_image_path, table_name):
    query = f"INSERT INTO {table_name} (file_path, processed_image_path) VALUES (%s, %s)"
    values = (file_path, processed_image_path)
    execute_query(query, values)

    
# Store file paths in MySQL tables
def store_restore_file_paths(file_path, restored_image_path, table_name):
    query = f"INSERT INTO {table_name} (file_path, restored_image_path) VALUES (%s, %s)"
    values = (file_path, restored_image_path)
    execute_query(query, values)

    

def calculate_psnr(original_img_path, processed_img_path):
    # Load images
    original_img = cv2.imread(original_img_path, cv2.IMREAD_GRAYSCALE)
    processed_img = cv2.imread(processed_img_path, cv2.IMREAD_GRAYSCALE)

    # Check if images are loaded properly
    if original_img is None or processed_img is None:
        raise ValueError("Error loading images")

    # Ensure images have the same shape and data type
    original_img = original_img.astype(np.float32)
    processed_img = processed_img.astype(np.float32)

    # Calculate mean squared error (MSE)
    mse = np.mean((original_img - processed_img) ** 2)

    # Calculate PSNR
    max_pixel_value = 255  # For an 8-bit image
    psnr = 10 * np.log10((max_pixel_value ** 2) / mse)

    # Convert values to standard Python types
    psnr = float(psnr)
    mse = float(mse)

    return psnr, mse


from flask import jsonify

# ... (existing code)

@app.route('/enhance', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # Processing the image and getting the processed image
    processed_image_path = enhance_Image(file_path)

    if processed_image_path is None:
        return jsonify({'error': 'Error processing the image'})

    store_enhance_file_paths(file_path, processed_image_path, 'enhance')



    #matrics-----------------------------------------------------------------------------------------
    input_image_path = file_path
    output_image_path = processed_image_path

    metrics = calculate_psnr(input_image_path, 'upload\\'+ output_image_path)

    if None in metrics:
        return jsonify({'error': 'Error computing input metrics'})
    # Extracting MSE and PSNR from the metrics
    mse, psnr = metrics

    print("MSE :", mse)
    print("PSNR :", psnr)

    # Prepare the response JSON
    response = {
        'processed_image_path': processed_image_path,
        'MSE': mse,
        'PSNR': psnr
    }

    # Return the response as JSON
    return jsonify(response)





@app.route('/restore', methods=['POST'])
def restore_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # Restoration algorithm
    restored_image_path = restore_Image(file_path)

    if restored_image_path is None:
        return jsonify({'error': 'Error processing the image'})

    # Store file paths in the 'restore' table
    store_restore_file_paths(file_path, restored_image_path, 'restore')

    #matrics-----------------------------------------------------------------------------------------
    input_image_path = file_path
    output_image_path = restored_image_path

    metrics = calculate_psnr(input_image_path, 'upload\\'+ output_image_path)

    if None in metrics:
        return jsonify({'error': 'Error computing input metrics'})
    # Extracting MSE and PSNR from the metrics
    mse, psnr = metrics

    print("MSE :", mse)
    print("PSNR :", psnr)

    # Prepare the response JSON
    response = {
        'restored_image_path': restored_image_path,
        'MSE': mse,
        'PSNR': psnr
    }

    # Return the response as JSON
    return jsonify(response)



# Retrieve links endpoint
@app.route('/get_links', methods=['GET'])
def get_links():
    query_enhance = "SELECT file_path, processed_image_path FROM enhance ORDER BY id DESC LIMIT 3"

    query_restore = "SELECT file_path, restored_image_path FROM restore ORDER BY id DESC LIMIT 3"

    print(query_enhance)
    links_enhance = execute_query(query_enhance)
    links_restore = execute_query(query_restore)
    print(links_enhance)
    response = {
        'enhance_links': links_enhance,
        'restore_links': links_restore
    }

    return jsonify(response)




@app.route("/uploads/<filename>")
def serve_file(filename):
    return send_from_directory("upload", filename)




def enhance_Image(file_path):
    # Read the image
    img = cv2.imread(file_path)  
    sceneRadiance = stretching(img)
    sceneRadiance = LABStretching(sceneRadiance)

    # Save the processed image
    processed_image_path = 'processed_' + os.path.basename(file_path)
    cv2.imwrite(os.path.join(app.config['UPLOAD_FOLDER'], processed_image_path), sceneRadiance)

    return processed_image_path  # Return the processed image filename

def restore_Image(file_path):
    # Restoration algorithm logic
    img = cv2.imread(file_path)

    blockSize = 9
    n = 5
    RGB_Darkchannel = getRGB_Darkchannel(img, blockSize)
    BlurrnessMap = blurrnessMap(img, blockSize, n)
    AtomsphericLightOne = getAtomsphericLightDCP_Bright(RGB_Darkchannel, img, percent=0.001)
    AtomsphericLightTwo = getAtomsphericLightLv(img)
    AtomsphericLightThree = getAtomsphericLightLb(img, blockSize, n)
    AtomsphericLight = ThreeAtomsphericLightFusion(AtomsphericLightOne, AtomsphericLightTwo, AtomsphericLightThree, img)
    print('AtomsphericLight', AtomsphericLight)  # [b,g,r]

    R_map = max_R(img, blockSize)
    mip_map = R_minus_GB(img, blockSize, R_map)
    bluriness_map = BlurrnessMap

    d_R = 1 - StretchingFusion(R_map)
    d_D = 1 - StretchingFusion(mip_map)
    d_B = 1 - StretchingFusion(bluriness_map)

    d_n = Scene_depth(d_R, d_D, d_B, img, AtomsphericLight)
    d_n_stretching = global_stretching(d_n)
    d_0 = closePoint(img, AtomsphericLight)
    d_f = 8 * (d_n + d_0)

    transmissionR = getTransmission(d_f)
    transmissionB, transmissionG = getGBTransmissionESt(transmissionR, AtomsphericLight)
    transmissionB, transmissionG, transmissionR = Refinedtransmission(transmissionB, transmissionG, transmissionR, img)

    sceneRadiance = sceneRadianceRGB(img, transmissionB, transmissionG, transmissionR, AtomsphericLight)

    restored_image_path = 'restored_' + os.path.basename(file_path)
    cv2.imwrite(os.path.join(app.config['UPLOAD_FOLDER'], restored_image_path), sceneRadiance)

    return restored_image_path  # Return the restored image filename




if __name__ == '__main__':
    app.run(debug=True)
