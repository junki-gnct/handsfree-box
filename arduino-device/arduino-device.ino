#include<Wire.h>
#include<Adafruit_GFX.h>
#include<Adafruit_SSD1306.h>
#include <Servo.h>

Adafruit_SSD1306 display(-1);
Servo myServo;

void setup() {
  Serial.begin(19200);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  myServo.attach(10);
  pinMode(2, INPUT_PULLUP);
  pinMode(3, INPUT_PULLUP);
  pinMode(5, INPUT_PULLUP);
  pinMode(6, INPUT_PULLUP);
}

void printShortLongText(String shortt, String longt) {
  display.clearDisplay();
  display.setTextColor(WHITE);  
  display.setCursor(0, 0);
  display.setTextSize(2);
  display.println(shortt);
  display.setTextSize(1);
  display.println("");
  display.println(longt);
  display.display();
}

int prev_mode = 0;
int prev_state = 1;

bool isLocked = false;
int key_c = 0;
int count = 0;
int ka_count = 0;
int input;
String in_str;

int cds[3] = {0, 0, 0};
int before_cds[3] = {0, 0, 0};
int cds2[3] = {0, 0, 0};
int before_cds2[3] = {0, 0, 0};
int mode0_state = 0;
int mode0_cur = 0;

int lcd = 0;
void loop() {
  key_c++;
  int mode = prev_mode; 
  int state = prev_state; 
  if(key_c % 50 == 0) {
    key_c = 0;
    mode = (digitalRead(2) == HIGH ? 0 : 1 * pow(2, 2)) + (digitalRead(3) == HIGH ? 0 : 1 * pow(2, 1)) + (digitalRead(5) == HIGH ? 0 : 1 * pow(2, 0));
    state = (digitalRead(6) == HIGH ? 0 : 1);
    cds[0] = analogRead(A0) >= 512 ? 0 : 1;
    cds[1] = analogRead(A1) >= 512 ? 0 : 1;
    cds[2] = analogRead(A2) >= 512 ? 0 : 1;
    if (mode == 2) {
      cds2[0] = analogRead(A0);
      cds2[1] = analogRead(A1);
      cds2[2] = analogRead(A2);
    }
  }
 
  if(state != prev_state) {
    mode0_state = 0;
    mode0_cur = 0;
    Serial.println("STATE_" + String(state));
  }
  
  if(mode != prev_mode) {
    mode0_state = 0;
    mode0_cur = 0;
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
        Serial.println(String(mode) + "_" + String(state) + "_" + String(isLocked ? 1 : 0));
      } else if(in_str == "KeepAlive") {
        // Keep-alive (Receive)
        count = 0;
        ka_count = 0;
        in_str = "";
      } else if(in_str == "LOCK" && state != 0) {
        isLocked = true;
        mode0_state = 0;
        mode0_cur = 0;
        myServo.write(1);
      
        Serial.println("LOCK_" + (isLocked ? 1 : 0));
      } else if(in_str == "UNLOCK" && state != 0) {
        isLocked = false;
        mode0_state = 0;
        mode0_cur = 0;
        myServo.write(179);
        
        Serial.println("LOCK_" + (isLocked ? 1 : 0));
      }
      
      Serial.println("RECV " + in_str);
      in_str = "";
  }

  // Keep-alive (Check)
  if(ka_count >= 5) {
    if (lcd != 1) printShortLongText("Offline", "Check your connection");
    lcd = 1;
    return;
  } else if(state == 0) {
    if (lcd != 2) printShortLongText("Disabled", "Check switch state");
    lcd = 2;
  } else if(mode == 1 || mode == 2) {
    // do nothing.
  } else if (isLocked) {
    if (lcd != 3) printShortLongText("Locked", "User website to unlock");
    lcd = 3;
  } else if (!isLocked) {
    if (lcd != 4) printShortLongText("Unlocked", "       [Lock]     ");
    lcd = 4;
  }
  
  // Keep-alive (Count)
  if(count % 200 == 0) {
    count = 0;
    // ka_count++;
  }

  if(state == 0) return;

  if(mode == 0) {
    // Normal mode.
    if(!isLocked) {
      if(cds[1] == 1 && mode0_state == 0) {
        printShortLongText("Really?", "   [No]       Yes ");
        lcd = 4;
        mode0_state = 1;
      } else if(cds[1] == 0 && mode0_state == 1) {
        // wait to 0 prevent chattering
        mode0_state = 2;
      } else if(mode0_state == 2) {
        if(cds[0] == 1 && cds[1] == 0 && cds[2] == 0) {
          if(mode0_cur == 1) {
            printShortLongText("Really?", "   [No]       Yes ");
            mode0_cur = 0;
          }
          mode0_state = 3;
        } else if(cds[0] == 0 && cds[1] == 1 && cds[2] == 0) {
          if(mode0_cur == 1) {
            Serial.println("LOCKME");
          } else {
            printShortLongText("Unlocked", "       [Lock]     ");
          }
          mode0_cur = 0;
          mode0_state = 4;
        } else if(cds[0] == 0 && cds[1] == 0 && cds[2] == 1) {
          if(mode0_cur == 0) {
            printShortLongText("Really?", "    No       [Yes] ");
            mode0_cur = 1;
          }
          mode0_state = 3;
        }
      } else if(cds[0] == 0 && cds[1] == 0 && cds[2] == 0 && mode0_state == 3) {
        mode0_state = 2;
      } else if(cds[0] == 0 && cds[1] == 0 && cds[2] == 0 && mode0_state == 4) {
        mode0_state = 0;
      }
    }
  } else if(mode == 1) {
    // CdS adjusting mode.
    if(cds[0] != before_cds[0] || cds[1] != before_cds[1] || cds[2] != before_cds[2] || lcd != 5) {
      printShortLongText("CdS Check", String(cds[0]) + "  " + String(cds[1]) + "  " + String(cds[2]));
      lcd = 5;
    }
  } else if(mode == 2) {
    // Adv CdS adjusting mode.
    if(cds2[0] != before_cds2[0] || cds2[1] != before_cds2[1] || cds2[2] != before_cds2[2] || lcd != 6) {
      printShortLongText("CdS Check2", String(cds2[0]) + "  " + String(cds2[1]) + "  " + String(cds2[2]));
      lcd = 6;
    }
  }

  before_cds[0] = cds[0];
  before_cds[1] = cds[1];
  before_cds[2] = cds[2];
  before_cds2[0] = cds2[0];
  before_cds2[1] = cds2[1];
  before_cds2[2] = cds2[2];
  delay(10);
}
