import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:frontend/widgets/alertMessage.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _loginController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _validated = false;
  bool _show = false;
  String _message = '';
  bool _logged = false;

  @override
  void initState() {
    super.initState();
    checkCookie();
  }

  Future<void> checkCookie() async {
    try {
      final response = await http.get(
        Uri.parse('http://localhost:30004/auth/cookies'),
        headers: {'withCredentials': 'true'},
      );
      final data = json.decode(response.body);
      if (data['valid']) {
        Navigator.pushReplacementNamed(context, '/home');
      }
    } catch (err) {
      print("No session cookie");
    }
  }

  Future<void> register() async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:30004/auth'),
        body: json.encode({
          'login': _loginController.text,
          'password': _passwordController.text,
        }),
        headers: {'Content-Type': 'application/json'},
      );
      final data = json.decode(response.body);
      setState(() {
        _message = data['message'];
        _logged = data['logged'];
        _show = true;
      });
      if (_logged) {
        Future.delayed( Duration(seconds: 1), () {
          Navigator.pushReplacementNamed(context, '/home');
        });
      } else {
        Future.delayed( Duration(seconds: 1), () {
          setState(() {
            _show = false;
          });
        });
      }
    } catch (err) {
      setState(() {
        _message = "Error logging in";
        _logged = false;
        _show = true;
      });
      Future.delayed( Duration(seconds: 1), () {
        setState(() {
          _show = false;
        });
      });
    }
  }

  void _handleSubmit() {
    if (_loginController.text.isNotEmpty && _passwordController.text.isNotEmpty) {
      register();
      setState(() {
        _validated = true;
      });
    } else {
      setState(() {
        _validated = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title:  Text('Login'),
      ),
      body: Padding(
        padding:  EdgeInsets.all(16.0),
        child: Center(
          child: Column(
            children: [
              AlertMessage(
                show: _show,
                variant: _logged ? 'success' : 'danger',
                title: _logged ? 'Success' : 'Error',
                message: _message,
              ),
              Card(
                child: Padding(
                  padding:  EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                       Text(
                        'Log in',
                        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                       SizedBox(height: 20),
                      TextField(
                        controller: _loginController,
                        enabled: !_logged,
                        decoration: InputDecoration(
                          labelText: 'Login',
                          errorText: _validated || _loginController.text.isNotEmpty
                              ? null
                              : 'Login is required',
                        ),
                      ),
                       SizedBox(height: 20),
                      TextField(
                        controller: _passwordController,
                        enabled: !_logged,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          errorText: _validated || _passwordController.text.isNotEmpty
                              ? null
                              : 'Password is required',
                        ),
                        obscureText: true,
                      ),
                      SizedBox(height: 20),
                      TextButton(
                        onPressed: () {
                          Navigator.pushNamed(context, '/register');
                        },
                        child:  Text('Don\'t have an account? Register here'),
                      ),
                       SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: _handleSubmit,
                        child:  Text('Log in'),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
