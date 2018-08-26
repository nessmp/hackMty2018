#include <Arduino.h>

int semaforos[4][3];
String protocol;
int n=4;
char incomingChar;
int numberOfCars[4];
int carros[4][4];

void setSemaforo(int semaforoAct, int modo){
  Serial.print("Pongo el semaforo: ");
  Serial.print(semaforoAct);
  Serial.print("Puertos: ");
  for(int i=0; i<3; i++){
    Serial.print(semaforos[semaforoAct][i]);
  }
  Serial.println("");
  //prenderCarros(semaforoAct,numberOfCars);
  if(modo==100){
    //Rojo
    digitalWrite(semaforos[semaforoAct][0],HIGH);
    digitalWrite(semaforos[semaforoAct][1],LOW);
    digitalWrite(semaforos[semaforoAct][2],LOW);
    Serial.println("Rojo");
  }
  else if(modo==010){
    //Amarilo
    digitalWrite(semaforos[semaforoAct][0],LOW);
    digitalWrite(semaforos[semaforoAct][1],HIGH);
    digitalWrite(semaforos[semaforoAct][2],LOW);
    Serial.println("Amarillo");
  }
  else{
    //Verde
    digitalWrite(semaforos[semaforoAct][0],LOW);
    digitalWrite(semaforos[semaforoAct][1],LOW);
    digitalWrite(semaforos[semaforoAct][2],HIGH);
    Serial.println("Verde");
    //disminuirCarros(semaforoAct,numberOfCars);
  }
  delay(10);

}
void setup() {
  Serial.begin(9600);
  int port=3;
  for(int i=0; i<n; i++){
    for(int x=0;x<3;x++){
      semaforos[i][x] =port;
      pinMode(port, OUTPUT);
    //  Serial.print("Set Output: ");
    //  Serial.println(port);
      port++;
      delay(100);
    }
  }
  protocol = "VARV";
}

void loop() {
  protocol="";
  if (Serial.available() > 0) {
                int i=0;
                while(i<4){
                  if(Serial.available()>0){
                    incomingChar = Serial.read();
                    /*if(i>=4){
                      numberOfCars[i-4] = int(incomingChar);
                    }
                    else{

                    }
                    */
                    protocol+=incomingChar;
                    // say what you got:
                    Serial.print("I received: ");
                    Serial.println(incomingChar);
                    i++;
                  }
                }
              Serial.println(protocol);
        }
  for(int i=0; i<n; i++){
    switch(protocol[i]){
      case 'R':
        setSemaforo(i,100);
        break;
      case 'A':
        setSemaforo(i,010);
        break;
      case 'V':
        setSemaforo(i,001);
        break;
      default:
        int i=0;
        //Serial.println("No cambio ese semaforo");
      }
  }
    // put your main code here, to run repeatedly:
}
