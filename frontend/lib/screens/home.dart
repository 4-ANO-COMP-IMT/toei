import 'package:flutter/material.dart';
import 'package:dio/dio.dart';

void main() {
  runApp(MyApp());
}

// Create a singleton Dio instance
class DioClient {
  static final DioClient _instance = DioClient._internal();
  factory DioClient() => _instance;

  final Dio dio;

  DioClient._internal()
      : dio = Dio(BaseOptions(
          contentType: 'application/json',
          headers: {
            'Content-Type': 'application/json',
          },
        )) {
    // Optionally configure interceptors or other settings
  }

  Future<Response> post(String url, {dynamic data}) async {
    return await dio.post(
      url,
      data: data,
      options: Options(
        extra: {'withCredentials': true},
      ),
    );
  }

  Future<Response> get(String url) async {
    return await dio.get(
      url,
      options: Options(
        extra: {'withCredentials': true},
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Artwork Search',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: HomePage(),
    );
  }
}

class TagFilterPopup extends StatefulWidget {
  final List<String> tags;
  final List<bool> selectedTags;
  final String label;
  final Function(List<bool>) onSelectionChanged;

  TagFilterPopup({
    required this.tags,
    required this.selectedTags,
    required this.label,
    required this.onSelectionChanged,
  });

  @override
  _TagFilterPopupState createState() => _TagFilterPopupState();
}

class _TagFilterPopupState extends State<TagFilterPopup> {
  late List<bool> _currentSelections;

  @override
  void initState() {
    super.initState();
    _currentSelections = List.from(widget.selectedTags);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.label),
      content: SingleChildScrollView(
        child: Column(
          children: widget.tags.asMap().entries.map((entry) {
            int index = entry.key;
            String tag = entry.value;
            return CheckboxListTile(
              title: Text(tag),
              value: _currentSelections[index],
              onChanged: (bool? value) {
                setState(() {
                  _currentSelections[index] = value ?? false;
                });
              },
            );
          }).toList(),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            // Call the callback to update the parent state
            widget.onSelectionChanged(_currentSelections);
            Navigator.of(context).pop();
          },
          child: Text('Close'),
        )
      ],
    );
  }
}


class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<String> _tagNames = [];
  List<bool> _tags = [];
  List<bool> _filters = [];
  List _artworks = [];
  String _search = '';

  @override
  void initState() {
    super.initState();
    checkLogin();
    fetchTags();
    fetchArtworks();
  }

  // Check cookies for login
  void checkLogin() async {
    try {
      var response = await DioClient().get('http://localhost:4000/auth/cookies/');
      if (response.data['valid'] == false) {
        Navigator.pushReplacementNamed(context, '/login');
      }
    } catch (e) {
      print('Error: $e');
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  void disconnect() async {
    try {
      var response = await DioClient().get('http://localhost:4000/auth/disconnect/');
      if (response.data['disconnected'] == true) {
        Navigator.pushReplacementNamed(context, '/login');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  // Fetch tags from the backend
  void fetchTags() async {
    try {
      var response = await DioClient().get('http://localhost:8000/query/tags/');
      if (response.data['read']) {
        setState(() {
          _tagNames = List<String>.from(response.data['tags'][0]['tags']);
          _tags = List<bool>.filled(_tagNames.length, false);
          _filters = List<bool>.filled(_tagNames.length, false);
        });
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  // Fetch initial artworks
  void fetchArtworks() async {
    try {
      var response = await DioClient().post('http://localhost:8000/query/', data: {
        'formInputs': {
          'title': '',
          'tags': [],
          'filters': [],
          'sort': '_id',
          'order': false
        }
      });
      setState(() {
        _artworks = response.data['artworks'];
      });
    } catch (e) {
      print('Error: $e');
    }
  }

  // Handle search input
  void handleSearch(String value) {
    setState(() {
      _search = value;
    });
  }

  // Handle the search request
  void searchArtworks() async {
    List<String> selectedTags = [];
    List<String> selectedFilters = [];

    for (int i = 0; i < _tagNames.length; i++) {
      if (_tags[i]) selectedTags.add(_tagNames[i]);
      if (_filters[i]) selectedFilters.add(_tagNames[i]);
    }

    try {
      var response = await DioClient().post('http://localhost:8000/query/', data: {
        'formInputs': {
          'title': _search,
          'tags': selectedTags,
          'filters': selectedFilters,
          'sort': '_id',
          'order': false
        }
      });
      setState(() {
        _artworks = response.data['artworks'];
      });
    } catch (e) {
      print('Error: $e');
    }
  }



  // Popup for tags and filters
  void showTagFilterPopup(List<bool> selectedState, String label) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return TagFilterPopup(
          tags: _tagNames,
          selectedTags: selectedState,
          label: label,
          onSelectionChanged: (newSelections) {
            setState(() {
              // Update the parent state with the new selections
              if (label == 'Tags') {
                _tags = newSelections;
              } else {
                _filters = newSelections;
              }
            });
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Toei'),
        actions: [
          ElevatedButton(
            onPressed: () {
              // Navigate to create artwork page
            },
            child: Text('Create Artwork'),
          ),
          PopupMenuButton<String>(
            icon: Icon(Icons.account_circle),
            onSelected: (value) {
              if (value == 'Profile') {
                // Navigate to profile page
              } else if (value == 'Disconnect') {
                disconnect();
              }
            },
            itemBuilder: (BuildContext context) {
              return {'Profile', 'Disconnect'}.map((String choice) {
                return PopupMenuItem<String>(
                  value: choice,
                  child: Text(choice),
                );
              }).toList();
            },
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Search',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            TextField(
              onChanged: handleSearch,
              decoration: InputDecoration(
                labelText: 'Title',
                suffixIcon: IconButton(
                  icon: Icon(Icons.search),
                  onPressed: searchArtworks,
                ),
              ),
            ),
            SizedBox(height: 10),
            Row(
              children: [
                ElevatedButton(
                  onPressed: () {
                    showTagFilterPopup(_tags, 'Tags');
                  },
                  child: Text('Tags'),
                ),
                SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () {
                    showTagFilterPopup(_filters, 'Filters');
                  },
                  child: Text('Filters'),
                ),
              ],
            ),
            SizedBox(height: 20),
            Expanded(
              child: GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 3 / 2,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                ),
                itemCount: _artworks.length,
                itemBuilder: (context, index) {
                  var artwork = _artworks[index];
                  return Card(
                    elevation: 5,
                    child: Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            artwork['artwork']['title'],
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 5),
                          Text(
                            artwork['artwork']['description'],
                            maxLines: 3, // Limit to 3 lines
                            overflow: TextOverflow.ellipsis, // Add ellipsis if text is too long
                            style: TextStyle(
                              fontSize: 14, // Adjust the font size as needed
                              color: Colors.black54, // Optional: Change color for better readability
                            ),
                          ),
                          SizedBox(height: 5),
                          Wrap(
                            spacing: 5,
                            children: artwork['artwork']['tags']
                                .map<Widget>((tag) => Chip(label: Text(tag)))
                                .toList(),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),            
          ],
        ),
      ),
    );
  }
}