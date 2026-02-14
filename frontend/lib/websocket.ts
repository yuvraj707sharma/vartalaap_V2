export class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private onMessageCallback: ((data: any) => void) | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000

  constructor(url: string) {
    this.url = url
  }

  connect(userId: string, nativeLanguage: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${this.url}?user_id=${userId}&native_language=${nativeLanguage}`
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            if (this.onMessageCallback) {
              this.onMessageCallback(data)
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.attemptReconnect(userId, nativeLanguage)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private attemptReconnect(userId: string, nativeLanguage: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      
      setTimeout(() => {
        this.connect(userId, nativeLanguage).catch((error) => {
          console.error('Reconnection failed:', error)
        })
      }, this.reconnectDelay)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  sendBinary(data: ArrayBuffer | Blob) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data)
    } else {
      console.error('WebSocket is not connected')
    }
  }

  onMessage(callback: (data: any) => void) {
    this.onMessageCallback = callback
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}
