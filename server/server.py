import websockets
import asyncio
import time
import numpy as np

PORT = 8765
print("server listening on port " + str(PORT))


async def main(websocket):
  print("a client just connected")
  prev_message_time = None
  pixel_data_store = []
  try:
    async for message in websocket:
      current_time = time.time()
      if prev_message_time is not None:
        latency_ms = (current_time - prev_message_time) * 1000
        print("Latency (ms) since previous message:", latency_ms)
      prev_message_time = current_time

      pixel_data = np.frombuffer(message, dtype=np.uint8)
      pixel_data_store.append(pixel_data)

      if len(pixel_data_store) < 10:
        continue

      # 🤖
      frames = np.array(pixel_data_store).reshape(10, 240, 240, 4)[:, :, :, :3]
      print(frames.shape)

      pixel_data_store = []
  except websockets.exceptions.ConnectionClosed as e:
    print("a client just disconnected", e)


start_server = websockets.serve(main, "localhost", PORT)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
