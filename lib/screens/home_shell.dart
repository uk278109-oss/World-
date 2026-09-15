import 'package:flutter/material.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int index = 0;

  final List<String> labels = const [
    'NOW',
    'FLOW',
    'SCENES',
    'TALK',
    'SPACE',
  ];

  final List<IconData> icons = const [
    Icons.radio_outlined,
    Icons.dynamic_feed_outlined,
    Icons.explore_outlined,
    Icons.forum_outlined,
    Icons.person_outline,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF08090B),
      body: SafeArea(
        child: Stack(
          children: [
            Center(
              child: Text(
                labels[index],
                style: const TextStyle(
                  fontSize: 34,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 2,
                ),
              ),
            ),

            Align(
              alignment: Alignment.bottomCenter,
              child: NavigationBar(
                selectedIndex: index,
                onDestinationSelected: (value) {
                  setState(() {
                    index = value;
                  });
                },
                destinations: List.generate(
                  labels.length,
                  (i) => NavigationDestination(
                    icon: Icon(icons[i]),
                    label: labels[i],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.auto_awesome),
      ),
    );
  }
}
