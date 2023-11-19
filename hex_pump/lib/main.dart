import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'dart:convert';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late ImagePicker _imagePicker;
  XFile? _image;

  @override
  void initState() {
    super.initState();
    _imagePicker = ImagePicker();
  }

  Future<void> _takePicture() async {
    final XFile? image = await _imagePicker.pickImage(source: ImageSource.camera);
    print('IMAGE');
    setState(() {
      _image = image;
    });
  }

  Future<void> _uploadImage() async {
    if (_image == null) {
      print('No image selected.');
      return;
    }

    print('image selected.');

    // Prepare the image file to be sent
    List<int> imageBytes = await _image!.readAsBytes();
    String base64Image = base64Encode(imageBytes);

    print("[baby]");
    print(base64Image);

    // Send the image to the server
    final response = await http.post(
      Uri.parse('http://192.168.182.40:3000/'),
      body: {'image': base64Image},
    );

    // Handle the server response
    if (response.statusCode == 200) {
      print('Image uploaded successfully. Server response: ${response.body}');
    } else {
      print('Failed to upload image. Server response: ${response.body}');
    }
  }

  Future<void> _sendDecision(String decision) async {
    // Send the decision to the server
    final response = await http.post(
      Uri.parse('http://192.168.182.40:3000/'),
      body: {'yesno': decision},
    );
  }

  String receivedString = 'No string received yet';

  Future<void> fetchDataFromNodeJS() async {
    final response = await http.get(Uri.parse('http://192.168.182.40:3000/'));

    if (response.statusCode == 200) {
      setState(() {
        // Assuming the server responds with a JSON object containing the string
        Map<String, dynamic> data = json.decode(response.body);
        receivedString = data['yourString'];
      });
    } else {
      print('Failed to fetch string. Server response: ${response.body}');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Camera App'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            _image == null
                  ? Text('Take a PIC')
                : Image.file(File(_image!.path)),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _takePicture,
              child: Text('Take Picture'),
            ),
            FloatingActionButton(
              onPressed: _uploadImage,
              tooltip: 'Upload image',
              child: Icon(Icons.cloud_upload),
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () => _sendDecision('yes'),
                  child: Text('Yes'),
                ),
                ElevatedButton(
                onPressed: () => _sendDecision('no'),
                child: Text('No'),
                ),
              ],
            ),
            Text('Received String:', style: TextStyle(fontSize: 18)),
            SizedBox(height: 10),
            Text(receivedString, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: fetchDataFromNodeJS,
              child: Text('Fetch String from Node.js'),
            ),
          ],
        ),
      ),
    );
  }
}