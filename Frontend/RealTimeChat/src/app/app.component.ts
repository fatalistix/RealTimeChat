import { Component, OnDestroy, OnInit } from "@angular/core";
import { SocketService } from "./socket.service";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit, OnDestroy {
  public messages: Array<any>;
  public chatBox: string;
  public title = "Real time chat";

  public constructor(private socket: SocketService) {
    this.messages = [];
    this.chatBox = "";
  }

  public ngOnInit() {
    this.socket.getEventListener().subscribe((event: any) => {
      if (event.type == "message") {
        let data = event.data.content;
        if (event.data.sender) {
          data = event.data.sender + ": " + data;
        }
        this.messages.push(data);
      }
      if (event.type == "close") {
        this.messages.push("/The socket connection has been closed");
      }
      if (event.type == "open") {
        this.messages.push("/The socket connection has been established");
      }
    });
  }

  public ngOnDestroy() {
    this.socket.close();
  }

  public send() {
    if (this.chatBox) {
      this.socket.send(this.chatBox);
      this.chatBox = "";
    }
  }

  public isSystemMessage(message: string) {
    return message.startsWith(
        "/",
      )
      ? "<strong>" + message.substring(1) + "</strong>"
      : message;
  }
}
