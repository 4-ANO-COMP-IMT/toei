import 'package:flutter/material.dart';
import 'package:frontend/screens/login.dart';

void main() {
  runApp(MaterialApp(
    title: 'Login',
    theme: ThemeData(
      primarySwatch: Colors.blue,
    ),
    home: LoginPage(),
    debugShowCheckedModeBanner: false, // Remove a faixa de debug
  ));
}
