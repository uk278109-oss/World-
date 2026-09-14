import 'package:appwrite/appwrite.dart';
import '../config/app_config.dart';

class AppwriteService {
  static final Client client = Client()
    ..setEndpoint(AppConfig.appwriteEndpoint)
    ..setProject(AppConfig.appwriteProjectId);
  static final Account account = Account(client);
  static final Databases databases = Databases(client);
  static final Realtime realtime = Realtime(client);
  static final Storage storage = Storage(client);
}
