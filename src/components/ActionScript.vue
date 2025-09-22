<template>
  <v-col cols="12">
    <v-row>
      <!-- COL 1: KỊCH BẢN -->
      <v-col cols="9">
        <v-card
          class="pa-4"
          :title="`Kịch bản ${index + 1} - ${scriptContent.length}/1000 ký tự`"
          style="text-align: start"
        >
          <v-card-text>{{ scriptContent }}</v-card-text>
          <template v-slot:actions>
            <v-btn
              color="blue-lighten-2"
              text="Tạo prompt ảnh"
              variant="elevated"
              block
              :loading="isGeneratingImages"
              @click="handleGenerateImagePrompts"
              prepend-icon="mdi-image-multiple"
            ></v-btn>
          </template>
        </v-card>

        <!-- Prompts List -->
        <v-card
          v-if="imagePrompts.length > 0"
          class="mt-3"
          title="10 Prompt tạo ảnh"
        >
          <v-card-text style="max-height: 50vh; overflow-y: auto">
            <div
              v-for="(prompt, index) in imagePrompts"
              :key="index"
              class="mb-3"
            >
              <PromptItem
                :prompt-text="prompt"
                :index="index"
                :is-generating-image="generatingImageIndex === index"
                :generated-image="generatedImages[index]"
                @update-prompt="updatePrompt"
                @copy-prompt="copyPrompt"
                @generate-image="generateImageFromPrompt"
                @download-image="downloadImage"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- COL 2: BUTTONS XỬ LÝ SCRIPT -->
      <v-col cols="3">
        <v-card height="auto" class="d-flex flex-column">
          <v-card-text class="flex-grow-1">
            <!-- Voice Settings -->
            <v-expansion-panels v-model="settingsPanel" class="mb-3">
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <v-icon start>mdi-tune</v-icon>
                  Cài đặt giọng nói
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-slider
                    v-model="voiceSettings.speed"
                    label="Speed"
                    min="0.25"
                    max="4.0"
                    step="0.1"
                    thumb-label
                    class="mb-2"
                  >
                    <template v-slot:append>
                      <v-text-field
                        v-model="voiceSettings.speed"
                        type="number"
                        density="compact"
                        hide-details
                        variant="outlined"
                        min="0.25"
                        max="4.0"
                        step="0.1"
                      ></v-text-field>
                    </template>
                  </v-slider>

                  <v-slider
                    v-model="voiceSettings.stability"
                    label="Stability"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    thumb-label
                    class="mb-2"
                  >
                    <template v-slot:append>
                      <v-text-field
                        v-model="voiceSettings.stability"
                        type="number"
                        density="compact"
                        hide-details
                        variant="outlined"
                        min="0.0"
                        max="1.0"
                        step="0.1"
                      ></v-text-field>
                    </template>
                  </v-slider>

                  <v-slider
                    v-model="voiceSettings.similarity"
                    label="Similarity"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    thumb-label
                  >
                    <template v-slot:append>
                      <v-text-field
                        v-model="voiceSettings.similarity"
                        type="number"
                        density="compact"
                        hide-details
                        variant="outlined"
                        min="0.0"
                        max="1.0"
                        step="0.1"
                      ></v-text-field>
                    </template>
                  </v-slider>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Audio Player -->
            <div v-if="audioUrl">
              <audio controls :src="audioUrl" class="w-100 mb-2"></audio>
              <v-btn
                color="green"
                text="Tải xuống"
                variant="outlined"
                block
                prepend-icon="mdi-download"
                @click="downloadAudio"
              ></v-btn>
            </div>
          </v-card-text>
          <template v-slot:actions>
            <v-btn
              color="red-lighten-2"
              text="Tạo giọng nói"
              variant="elevated"
              block
              :loading="isLoading"
              @click="handleTextToSpeech"
            ></v-btn>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import PromptItem from "./PromptItem.vue";

export default {
  name: "ActionScript",
  components: {
    PromptItem,
  },
  props: {
    scriptContent: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    apiKey: {
      type: String,
      required: true,
    },
    voiceId: {
      type: String,
      required: true,
    },
    geminiApiKey: {
      type: String,
      required: false,
      default: "",
    },
    geminiUsage: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      isLoading: false,
      audioUrl: null,
      settingsPanel: null,
      isGeneratingImages: false,
      imagePrompts: [],
      generatingImageIndex: null,
      generatedImages: {},
      voiceSettings: {
        speed: 1.0,
        stability: 0.5,
        similarity: 0.8,
      },
    };
  },
  emits: ["split-script", "update-gemini-usage"],
  methods: {
    handleSplitScript() {
      this.$emit("split-script", this.index);
    },
    async handleTextToSpeech() {
      if (!this.apiKey || !this.voiceId) {
        alert("Vui lòng nhập API Key và Voice ID");
        return;
      }

      this.isLoading = true;
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`,
          {
            method: "POST",
            headers: {
              Accept: "audio/mpeg",
              "Content-Type": "application/json",
              "xi-api-key": this.apiKey,
            },
            body: JSON.stringify({
              text: this.scriptContent,
              model_id: "eleven_monolingual_v1",
              voice_settings: {
                speed: this.voiceSettings.speed,
                stability: this.voiceSettings.stability,
                similarity_boost: this.voiceSettings.similarity,
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Lỗi khi tạo giọng nói");
        }

        const audioBlob = await response.blob();
        this.audioUrl = URL.createObjectURL(audioBlob);
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra khi tạo giọng nói");
      } finally {
        this.isLoading = false;
      }
    },
    downloadAudio() {
      if (this.audioUrl) {
        const link = document.createElement("a");
        link.href = this.audioUrl;
        link.download = `script_${this.index + 1}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    async handleGenerateImagePrompts() {
      if (!this.geminiApiKey) {
        alert("Vui lòng nhập Gemini API Key");
        return;
      }

      this.isGeneratingImages = true;
      try {
        const prompt = `Tôi cần tạo 10 prompt để tạo ảnh mô tả cho đoạn văn bản sau. Mỗi prompt phải chi tiết, rõ ràng để AI có thể tạo ra hình ảnh phù hợp với nội dung. Trả về dưới dạng danh sách được đánh số từ 1-10:

Nội dung: ${this.scriptContent}

Yêu cầu:
- Mỗi prompt phải mô tả cụ thể hình ảnh, màu sắc, không gian
- Phù hợp với nội dung văn bản
- Có thể dùng để tạo ảnh bằng AI
- Chỉ trả về 10 prompt, mỗi dòng một prompt`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Lỗi khi gọi Gemini API");
        }

        const data = await response.json();
        const generatedText = data.candidates[0].content.parts[0].text;

        // Track token usage
        const usageMetadata = data.usageMetadata;
        if (usageMetadata) {
          this.$emit("update-gemini-usage", {
            inputTokens: usageMetadata.promptTokenCount || 0,
            outputTokens: usageMetadata.candidatesTokenCount || 0,
            requests: 1
          });
        }

        // Parse the response to extract 10 prompts
        const lines = generatedText.split("\n").filter((line) => line.trim());
        this.imagePrompts = lines
          .filter((line) => /^\d+\./.test(line.trim()))
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .slice(0, 10);
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra khi tạo prompt ảnh");
      } finally {
        this.isGeneratingImages = false;
      }
    },
    copyPrompt(prompt) {
      navigator.clipboard
        .writeText(prompt)
        .then(() => {
          alert("Đã copy prompt!");
        })
        .catch(() => {
          alert("Không thể copy prompt");
        });
    },
    updatePrompt(index, newText) {
      this.imagePrompts[index] = newText;
    },
    async generateImageFromPrompt(index, prompt) {
      this.generatingImageIndex = index;
      try {
        // Thử sử dụng API tạo ảnh miễn phí khác (Pollinations)
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=683&model=flux&seed=${Date.now()}`;

        // Fetch ảnh từ URL
        const imageResponse = await fetch(imageUrl);

        if (!imageResponse.ok) {
          throw new Error(`Lỗi khi tạo ảnh: ${imageResponse.status}`);
        }

        // Tạo blob từ response
        const blob = await imageResponse.blob();
        const localImageUrl = URL.createObjectURL(blob);

        // Lưu thông tin ảnh đã tạo
        this.generatedImages[index] = {
          prompt: prompt,
          imageUrl: localImageUrl,
          blob: blob,
          timestamp: new Date().toLocaleString(),
        };

        alert(`Đã tạo ảnh thành công cho prompt ${index + 1}!`);
      } catch (error) {
        console.error("Lỗi:", error);
        alert(`Có lỗi xảy ra khi tạo ảnh: ${error.message}`);
      } finally {
        this.generatingImageIndex = null;
      }
    },
    downloadImage(index) {
      const imageData = this.generatedImages[index];
      if (imageData && imageData.blob) {
        const link = document.createElement("a");
        link.href = imageData.imageUrl;
        link.download = `image_script_${this.index + 1}_prompt_${
          index + 1
        }.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
  },
};
</script>
