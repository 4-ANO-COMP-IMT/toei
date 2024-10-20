import 'package:flutter/material.dart';
import 'package:frontend/screens/login.dart';
import 'package:frontend/screens/home.dart';

void main() {
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
