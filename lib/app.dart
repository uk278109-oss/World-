import 'package:flutter/material.dart';
import 'screens/home_shell.dart';

class WorldApp extends StatelessWidget {
  const WorldApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'WORLD',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFF08090B),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF7C5CFF),
          brightness: Brightness.dark,
        ),
      ),
      home: const HomeShell(),
    );
  }
}
