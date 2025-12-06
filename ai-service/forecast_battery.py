import google.generativeai as genai
import pandas as pd
import requests
import json
import sys
import io
from sqlalchemy import create_engine

# --- CẤU HÌNH HỆ THỐNG (ĐÃ CẬP NHẬT THEO ẢNH) ---

# 1. Google Gemini API Key
API_KEY = "AIzaSyBXUvVFD03TBvecYlEZ3Npkf7xxLifd82o" 

# 2. Cấu hình Database MySQL
DB_CONFIG = {
    "user": "user",
    "password": "password",  # <--- ĐIỀN MẬT KHẨU CỦA BẠN VÀO ĐÂY
    "host": "localhost",
    "port": "3308",
    "database": "payment_db" # <--- Đã đổi thành payment_db theo ảnh
}

# 3. API Spring Boot (Endpoint nhận StationDTO)
BACKEND_API_URL = "http://localhost:8067/api/stations/update-forecast"

# --- THIẾT LẬP MÔI TRƯỜNG ---
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('models/gemini-2.0-flash')

def get_data_from_db():
    """Kết nối MySQL và lấy dữ liệu từ bảng battery_swap_logs"""
    print("🔌 Đang kết nối Database payment_db...")
    try:
        connection_str = f"mysql+mysqlconnector://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
        engine = create_engine(connection_str)
        
        # --- CẬP NHẬT CÂU QUERY ---
        # Lưu ý: Hãy kiểm tra xem bảng battery_swap_logs có đúng là dùng cột 'station_id' và 'swap_time' không nhé.
        query = """
        SELECT station_id, swap_time 
        FROM battery_swap_logs 
        WHERE swap_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ORDER BY station_id, swap_time ASC
        """
        
        df = pd.read_sql(query, engine)
        print(f"✅ Đã tải {len(df)} dòng dữ liệu lịch sử từ battery_swap_logs.")
        return df
    except Exception as e:
        print(f"❌ Lỗi kết nối Database: {e}")
        return None

def analyze_and_forecast():
    # 1. Lấy dữ liệu
    df = get_data_from_db()
    
    if df is None or df.empty:
        print("⚠️ Không có dữ liệu để dự báo.")
        return

    try:
        # 2. Tiền xử lý dữ liệu
        df.columns = df.columns.str.strip() 
        df['swap_time'] = pd.to_datetime(df['swap_time'])
        df['hour'] = df['swap_time'].dt.hour
        df['date'] = df['swap_time'].dt.date

        # 3. Tạo ngữ cảnh (Context) cho từng trạm
        stations_summary = []
        unique_stations = df['station_id'].unique()

        print(f"🔍 Đang phân tích dữ liệu cho {len(unique_stations)} trạm...")

        for station_id in unique_stations:
            station_df = df[df['station_id'] == station_id]
            total_swaps = len(station_df)
            
            # Tìm khung giờ cao điểm
            hourly_counts = station_df['hour'].value_counts().sort_index()
            peak_hours_str = ", ".join([f"{h}h" for h, c in hourly_counts.nlargest(3).items()])
            
            # Xu hướng theo ngày
            daily_trend = station_df.groupby('date').size().tail(5)
            trend_str = ", ".join([f"{d}: {c}" for d, c in daily_trend.items()])

            summary_line = (
                f"- Station ID: {station_id} | "
                f"Tổng số lần đổi (30 ngày): {total_swaps} | "
                f"Xu hướng 5 ngày qua: [{trend_str}] | "
                f"Giờ cao điểm thường gặp: [{peak_hours_str}]"
            )
            stations_summary.append(summary_line)

        context_data = "\n".join(stations_summary)

        # 4. Gửi Prompt cho Gemini
        prompt = f"""
        Bạn là chuyên gia AI vận hành trạm sạc. Dựa vào lịch sử từ bảng log:
        
        {context_data}

        Hãy dự báo nhu cầu cho NGÀY MAI.
        Yêu cầu trả về JSON Array thuần túy (không markdown).
        Format JSON bắt buộc:
        [
            {{
                "stationId": 1, 
                "predictedSwaps": 50, 
                "peakHours": "17:00 - 19:00", 
                "note": "Ngắn gọn dưới 20 từ."
            }}
        ]
        """

        print("🚀 Đang gửi yêu cầu tới Gemini AI...")
        response = model.generate_content(prompt)
        
        # Clean response
        clean_json = response.text.strip().replace("```json", "").replace("```", "")
        forecast_results = json.loads(clean_json)

        print("\n📊 KẾT QUẢ AI TRẢ VỀ:")
        print(json.dumps(forecast_results, indent=2, ensure_ascii=False))

        # 5. Gửi về Backend (Sử dụng StationDTO)
        print("\n📡 Đang đồng bộ về Server Spring Boot...")
        
        for item in forecast_results:
            try:
                # B1: Đóng gói JSON thành chuỗi String
                ai_forecast_string = json.dumps(item, ensure_ascii=False)
                
                # B2: Tạo payload StationDTO
                payload = {
                    "id": item['stationId'],
                    "aiForecast": ai_forecast_string
                }

                # B3: Gọi API
                res = requests.post(BACKEND_API_URL, json=payload)
                
                if res.status_code == 200:
                    print(f"   ✅ Đã cập nhật thành công Station {item['stationId']}")
                else:
                    print(f"   ⚠️ Lỗi Backend Station {item['stationId']} ({res.status_code}): {res.text}")
                    
            except requests.exceptions.ConnectionError:
                print(f"   ❌ Không thể kết nối tới {BACKEND_API_URL}. Backend có đang chạy không?")
                break 
            except Exception as e:
                print(f"   ❌ Lỗi không xác định: {e}")

    except Exception as e:
        print(f"\n❌ CRITICAL ERROR: {e}")

if __name__ == "__main__":
    analyze_and_forecast()