# AI Services Usage & Pricing

## Tổng quan dự án
Tool tạo video tự động từ kịch bản sử dụng nhiều AI services khác nhau cho từng bước trong quy trình.

---

## 🎤 TEXT-TO-SPEECH (Bước 2)

### ElevenLabs TTS
**Đang sử dụng**: ✅ Active
**Mục đích**: Chuyển script text thành voice audio

#### API Details:
- **Endpoint**: `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`
- **Model**: `eleven_monolingual_v1`
- **Settings**: Speed (0.25-4.0), Stability (0.0-1.0), Similarity (0.0-1.0)

#### Pricing:
- **Free Tier**: 10,000 ký tự/tháng
- **Creator**: $5/tháng - 30,000 ký tự
- **Pro**: $22/tháng - 100,000 ký tự
- **Enterprise**: $99/tháng - 500,000 ký tự

#### Free Tier Strategy:
- Sử dụng nhiều email để tạo account mới
- Dùng proxy để xoay IP (ElevenLabs chặn multiple accounts cùng IP)
- Mỗi email = 10,000 ký tự miễn phí

---

## 🧠 PROMPT GENERATION (Bước 3)

### Google Gemini 1.5 Flash
**Đang sử dụng**: ✅ Active
**Mục đích**: Tạo 10 prompt ảnh từ script content

#### API Details:
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Model**: `gemini-1.5-flash` (Free tier)

#### Pricing:
- **Free Tier**:
  - 15 requests/minute
  - 1 million tokens/day
  - 32K tokens/request
- **Paid**: $0.075 per 1M input tokens, $0.30 per 1M output tokens

#### Free API Key:
- Lấy tại: https://aistudio.google.com/app/apikey
- Đăng nhập Google account
- Hoàn toàn miễn phí với limit trên

---

## 🖼️ IMAGE GENERATION (Bước 4)

### Pollinations AI
**Đang sử dụng**: ✅ Active
**Mục đích**: Tạo ảnh từ text prompt

#### API Details:
- **Endpoint**: `https://image.pollinations.ai/prompt/{encoded_prompt}`
- **Model**: Flux (state-of-the-art)
- **Params**: `?width=512&height=683&model=flux&seed={timestamp}`

#### Pricing:
- **Hoàn toàn miễn phí** ✅
- Không cần API key
- Không có rate limit
- Quality tốt với Flux model

#### Backup Options:
1. **Leonardo.AI**: $60/tháng - HD images
2. **SORA (ChatGPT Plus)**: $20/tháng - 200 ảnh/day
3. **Dream.AI (CapCut)**: Free tier available
4. **Whisk (Google)**: Free beta

---

## 📱 SERVICES SUMMARY

| Service | Type | Cost | Status | Notes |
|---------|------|------|--------|-------|
| ElevenLabs | TTS | $0 (10K chars) | ✅ Active | Cần proxy cho multiple accounts |
| Gemini 1.5 Flash | Text Gen | $0 (1M tokens/day) | ✅ Active | Google account required |
| Pollinations AI | Image Gen | $0 (Unlimited) | ✅ Active | No API key needed |

---

## 💡 OPTIMIZATION STRATEGIES

### Chi phí $0/tháng:
1. **ElevenLabs**: Tạo nhiều email + proxy rotation
2. **Gemini**: Sử dụng free tier (đủ cho project)
3. **Pollinations**: Hoàn toàn free

### Nâng cấp khi cần:
1. **Voice quality**: ElevenLabs Pro ($22/tháng)
2. **Image quality**: Leonardo.AI ($60/tháng)
3. **Video generation**: Veo-3 (20-50k VND/account)

---

## 🔄 WORKFLOW COST BREAKDOWN

### Ví dụ 1 video 10 phút:
- **Script**: ~6,000 ký tự
- **ElevenLabs**: 6 đoạn x 1000 ký tự = Free tier
- **Gemini**: 60 prompts (6 đoạn x 10) = Free tier
- **Pollinations**: 60 ảnh = Free
- **Total cost**: $0

### Scale lên 100 video/tháng:
- **ElevenLabs**: Cần ~10-15 accounts
- **Gemini**: Vẫn trong free tier
- **Pollinations**: Vẫn free
- **Total cost**: $0 (chỉ effort tạo accounts)

---

## 🚀 FUTURE ROADMAP

### Planned Services:
1. **Video synthesis**: FFmpeg (free) hoặc Python libraries
2. **Subtitle generation**: Speech-to-text từ audio
3. **Video effects**: OpenCV hoặc similar
4. **Auto upload**: YouTube/TikTok APIs

### Cost projection:
- **Current**: $0/tháng
- **With video hosting**: ~$10-20/tháng
- **With premium AI**: ~$100-150/tháng

---

## 📞 CONTACT & UPDATES

Tài liệu này được cập nhật: **19/09/2025**
Để biết thêm thông tin về rate limits và pricing changes, check official docs của từng service.