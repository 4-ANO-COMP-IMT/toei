import 'package:flutter/material.dart';

class AlertMessage extends StatelessWidget {
  final bool show;
  final String variant;
  final String title;
  final String message;

  AlertMessage({
    required this.show,
    required this.variant,
    required this.title,
    required this.message,
  });

  @override
  Widget build(BuildContext context) {
    if (!show) return SizedBox.shrink();

    Color getColor(String variant) {
      switch (variant) {
        case 'success':
          return Colors.green;
        case 'danger':
          return Colors.red;
        default:
          return Colors.blue;
      }
    }

    return Container(
      margin: EdgeInsets.only(bottom: 20),
      padding: EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: getColor(variant).withOpacity(0.1),
        border: Border.all(color: getColor(variant), width: 2),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: getColor(variant),
            ),
          ),
          SizedBox(height: 8),
          Text(
            message,
            style: TextStyle(fontSize: 16),
          ),
        ],
      ),
    );
  }
}
