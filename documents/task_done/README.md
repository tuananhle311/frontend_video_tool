# Task Done Documentation

## Tóm tắt dự án
Công cụ frontend tạo video từ kịch bản với tích hợp ElevenLabs Text-to-Speech API.

## Cấu trúc dự án
```
src/
├── App.vue                     # Component chính
├── components/
│   └── ActionScript.vue        # Component xử lý từng script item
└── utils/
    └── functions.js           # Utility functions (splitScripts)
```

## Các tính năng đã hoàn thành

### 1. Workflow Control System (Mới)
**File**: `src/App.vue`

**Chức năng**:
- Header với title "AI Video Generator Tool"
- Nút "Chạy toàn bộ workflow" để auto-execute
- Nút "Dừng" để stop workflow đang chạy
- Progress bar hiển thị tiến trình (Bước X/4)
- Requirements alert cho missing conditions
- Smart validation cho canRun state

**Features**:
- Auto chia kịch bản khi click "Chạy"
- Visual feedback với progress tracking
- Error handling và user notifications
- Workflow abort functionality

### 2. Gemini Usage Tracking System (Mới)
**File**: `src/App.vue`

**Chức năng**:
- Real-time token usage monitoring
- API key validation với visual feedback
- Daily quota tracking (1M tokens/day)
- Request per minute counter (15/min)
- Connection status indicator
- localStorage persistence với daily reset

**UI Components**:
- Progress bar cho token usage
- Color-coded status chips
- Connection icons (check/alert)
- Auto-fetch usage khi nhập API key

### 3. PromptItem Component (Mới)
**File**: `src/components/PromptItem.vue`

**Chức năng**:
- Component riêng cho mỗi prompt item
- Layout 8-2-2 (text-buttons-image)
- Inline image display với aspect ratio 3:4
- Edit prompt functionality
- Copy to clipboard
- Generate image với Pollinations AI
- Download image feature
- Visual placeholder khi chưa có ảnh

**Props**: `promptText`, `index`, `isGeneratingImage`, `generatedImage`
**Events**: `update-prompt`, `copy-prompt`, `generate-image`, `download-image`

### 4. Enhanced Script Splitting (Cập nhật)
**File**: `src/utils/functions.ts`

**Cải tiến**:
- Chia theo câu hoàn chỉnh (kết thúc bằng . ! ? hoặc \n)
- Giới hạn 1000 ký tự per segment
- Không cắt giữa câu trừ khi bắt buộc
- Filter empty segments
- Tối ưu cho TTS tự nhiên hơn

### 5. ActionScript Component (Cập nhật)
**File**: `src/components/ActionScript.vue`

**Layout mới (9-3 cols)**:
- **Cột 1 (9 cols)**: Kịch bản + Prompt list với PromptItem components
- **Cột 2 (3 cols)**: Voice settings + Audio controls

**Chức năng mới**:
- Tích hợp PromptItem component
- Gemini usage tracking events
- Voice settings với Speed, Stability, Similarity sliders
- Expansion panel cho voice config
- Enhanced error handling

**Props mới**:
- `geminiUsage`: Object - Usage tracking data
- `geminiApiKey`: String - Gemini API key

**Events mới**:
- `update-gemini-usage`: Emit token usage data

**Voice Settings**:
- Speed: 0.25-4.0 (tốc độ đọc)
- Stability: 0.0-1.0 (độ ổn định)
- Similarity: 0.0-1.0 (độ tương tự)

### 2. App.vue Updates
**File**: `src/App.vue`

**Thay đổi**:
- Import ActionScript component
- Sử dụng ActionScript component thay vì inline template
- Truyền props: `apiKey`, `voiceId`, `scriptContent`, `index`
- Giữ nguyên logic splitScripts và textToSpeech

**Template structure**:
```vue
<ActionScript
  v-for="(scriptContent, index) in scriptsResult"
  :key="index"
  :script-content="scriptContent"
  :index="index"
  :api-key="apiKey"
  :voice-id="voiceId"
  @split-script="handleSplitScript"
/>
```

## API Integration

### 1. ElevenLabs Text-to-Speech
- **Endpoint**: `https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`
- **Method**: POST
- **Headers**:
  - `Accept: audio/mpeg`
  - `Content-Type: application/json`
  - `xi-api-key: {api_key}`
- **Body**:
```json
{
  "text": "string",
  "model_id": "eleven_monolingual_v1",
  "voice_settings": {
    "speed": 1.0,
    "stability": 0.5,
    "similarity_boost": 0.8
  }
}
```

### 2. Google Gemini 1.5 Flash
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "contents": [
    {
      "parts": [{"text": "prompt_text"}]
    }
  ]
}
```
- **Usage Tracking**: Lấy từ `usageMetadata` trong response

### 3. Pollinations AI Image Generation
- **Endpoint**: `https://image.pollinations.ai/prompt/{encoded_prompt}`
- **Method**: GET
- **Parameters**: `?width=512&height=683&model=flux&seed={timestamp}`
- **Response**: Direct image blob
- **Cost**: Hoàn toàn miễn phí

### 4. Gemini API Validation
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models`
- **Method**: GET
- **Purpose**: Validate API key và check connection

## File Naming Convention
- Generated audio files: `script_{index + 1}.mp3`
- Generated image files: `image_script_{scriptIndex}_prompt_{promptIndex}.png`

## Dependencies
- Vue 3 với Composition API và Options API
- Vuetify (UI framework)
- TypeScript support
- Fetch API cho HTTP requests
- LocalStorage cho data persistence

## Technical Notes

### Component Architecture
- **Modular design**: PromptItem tách riêng từ ActionScript
- **Event-driven**: Parent-child communication qua emit/props
- **State management**: Reactive refs với computed properties
- **Mixed APIs**: Composition API (App.vue) + Options API (components)

### Data Persistence
- **LocalStorage**: Gemini usage data với daily reset
- **Session persistence**: API keys và settings
- **Auto-cleanup**: Daily reset cho token counters

### Error Handling
- **API validation**: Real-time connection checking
- **User-friendly alerts**: Contextual error messages
- **Graceful degradation**: Fallbacks khi API fails
- **Progress tracking**: Visual feedback cho long operations

### Performance Optimizations
- **Lazy loading**: Images chỉ load khi cần
- **Blob URLs**: Efficient memory usage cho media files
- **Event debouncing**: API calls optimization
- **Component isolation**: PromptItem independence

### Security Considerations
- **API key hiding**: Input type="password"
- **Client-side only**: Không lưu sensitive data server-side
- **CORS handling**: Proper headers cho cross-origin requests

## Current Status (19/09/2025)

### ✅ Completed Features
- **Steps 1-4** của 9-step workflow:
  1. ✅ Script splitting (enhanced với sentence boundary)
  2. ✅ Text-to-Speech (ElevenLabs với voice settings)
  3. ✅ Prompt generation (Gemini 1.5 Flash)
  4. ✅ Image generation (Pollinations AI với download)

### 🚧 In Progress
- Workflow automation với "Chạy toàn bộ" button
- Real-time usage tracking và quota monitoring
- Component modularization và code organization

### 📋 Next Steps (Steps 5-9)
- **Step 5**: Audio-Image synchronization (timeline matching)
- **Step 6**: Video segment merging (FFmpeg integration)
- **Step 7**: Subtitle generation (speech-to-text)
- **Step 8**: Video effects và transitions
- **Step 9**: Final video rendering và export

### 🎯 Technical Debt
- [ ] Add proper TypeScript types cho all components
- [ ] Implement proper error boundaries
- [ ] Add unit tests với Vitest
- [ ] Optimize bundle size với code splitting
- [ ] Add PWA capabilities cho offline usage

## Cost Analysis (Current Implementation)
- **ElevenLabs**: $0 (với multiple account strategy)
- **Gemini 1.5 Flash**: $0 (1M tokens/day free tier)
- **Pollinations AI**: $0 (unlimited free)
- **Total Monthly Cost**: $0

**Scale Projection**:
- 100 videos/month: ~$0 (trong free tiers)
- 1000 videos/month: ~$50-100 (premium tiers needed)