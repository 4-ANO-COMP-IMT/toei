import 'package:flutter/material.dart';
import 'package:frontend/screens/login.dart';
import 'package:frontend/screens/home.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future main() async {
  await dotenv.load(fileName: "assets/.env");
  myApp();
}

void myApp() {
  runApp(MaterialApp(
    title: 'Login',
    theme: ThemeData(
      primarySwatch: Colors.blue,
    ),
    home: LoginPage(),
    debugShowCheckedModeBanner: false,
    routes: {
      '/login': (context) => LoginPage(),
      '/home': (context) => HomePage(),
    },
  ));
}
