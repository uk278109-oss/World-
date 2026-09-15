import 'package:flutter/material.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});
  @override State<HomeShell> createState() => _HomeShellState();
}
class _HomeShellState extends State<HomeShell> {
  int index = 0;
  final labels = const ['NOW','FLOW','SCENES','TALK','SPACE'];
  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: Stack(children: [
        Center(child: Text(labels[index],
          style: const TextStyle(fontSize: 34, fontWeight: FontWeight.w700))),
        Align(alignment: Alignment.bottomCenter,
          child: NavigationBar(
            selectedIndex: index,
            onDestinationSelected: (v) => setState(() => index = v),
            destinations: const [
              NavigationDestination(icon: Icon(Icons.radio_outlined), label: 'NOW'),
              NavigationDestination(icon: Icon(Icons.dynamic_feed_outlined), label: 'FLOW'),
              NavigationDestination(icon: Icon(Icons.explore_outlined), label: 'SCENES'),
              NavigationDestination(icon: Icon(Icons.forum_outlined), label: 'TALK'),
              NavigationDestination(icon: Icon(Icons.person_outline), label: 'SPACE'),
            ],
          )),
      ]),
    ),
    floatingActionButton: FloatingActionButton(
      onPressed: () {}, child: const Icon(Icons.auto_awesome)),
  );
}
