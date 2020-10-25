void setup() {
  Serial.begin(19200);
  pinMode(2, INPUT_PULLUP);
  pinMode(3, INPUT_PULLUP);
  pinMode(5, INPUT_PULLUP);
  pinMode(6, INPUT_PULLUP);
}

int prev_mode = 0;
int prev_state = 1;

bool isLocked = false;
int key_c = 0;
int count = 0;
int ka_count = 0;
int input;
String in_str;

void loop() {
  // Check DIP switch.
  key_c++;
  int mode = prev_mode; 
  int state = prev_state; 
  if(key_c % 100 == 0) {
    key_c = 0;
    mode = (digitalRead(2) == HIGH ? 0 : 1 * pow(2, 2)) + (digitalRead(3) == HIGH ? 0 : 1 * pow(2, 1)) + (digitalRead(5) == HIGH ? 0 : 1 * pow(2, 0));
    state = (digitalRead(6) == HIGH ? 0 : 1);
  }
 
  if(state != prev_state) {
    // TODO: Change LCD Display.
    Serial.println("STATE_" + String(state));
  }
  
  if(mode != prev_mode) {
    // TODO: Change LCD Display if state is not 0.
    Serial.println("MODE_" + String(mode));
  }
  
  prev_mode = mode;
  prev_state = state;

  // Serial String Builder
  count++;
  input = Serial.read();
  while (input != -1) {
    in_str += String(char(input));
    if(char(input) == '\n') {
      input = -1;
    } else {
      input = Serial.read();
    }
  }

  // Serial command
  if(in_str.endsWith("\n")) {
      in_str.replace("\n", "");
      
      if(in_str == "Info") {
        // Device info
        Serial.println(mode + "_" + state + "_" + (isLocked ? 1 : 0));
      } else if(in_str == "KeepAlive") {
        // Keep-alive (Receive)
        count = 0;
        ka_count = 0;
        in_str = "";
      } else if(in_str == "LOCK") {
        isLocked = true;

        // TODO: move servo.
        
        Serial.println("LOCK_" + (isLocked ? 1 : 0));
      } else if(in_str == "UNLOCK") {
        isLocked = false;

        // TODO: move servo.
        
        Serial.println("LOCK_" + (isLocked ? 1 : 0));
      }
      
      Serial.println("RECV " + in_str);
  }

  // Keep-alive (Check)
  if(ka_count >= 5) {

    // TODO: Change LCD Display.
  
    return;
  }
  
  // Keep-alive (Count)
  if(count % 200 == 0) {
    count = 0;
    ka_count++;
  }

  if(state == 0) return;

  if(mode == 0) {
    // Normal mode.

    // CdS Check
    
  } else if(mode == 1){
    // CdS adjusting mode.
  }
  delay(10);
}
