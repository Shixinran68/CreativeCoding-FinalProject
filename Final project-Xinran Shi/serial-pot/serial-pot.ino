//Xinran Shi's final project for creative coding (Arduino)
//two switches/sensors used in the program: potentiometer and button

void setup() {
  Serial.begin(9600); // initialize serial communications
}
 
void loop() {
  // read the input pin A0
  int potentiometer = analogRead(A0);                  
  // remap the pot value to fit in 1 byte:
  int mappedPot = map(potentiometer, 0, 1023, 0, 255); 
  // print it out the serial port:
  Serial.println("potentiometer");
  delay(50);
  Serial.println(mappedPot);                             
  // slight delay to stabilize the ADC:
  delay(50);               

  // read the input pin D4
  int button = digitalRead(4);
  Serial.println("button");
  delay(50);// delay in between reads for stability
  Serial.println(button);
  delay(50);        
}
