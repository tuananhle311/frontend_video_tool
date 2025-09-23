<template>
  <v-container
    fluid
    style="
      width: 100vw;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: start;
      padding: 10px;
      text-align: center;
      background-color: #edede9;
    "
  >
    <!-- Header với nút chạy -->
    <v-card width="100%" class="mb-3">
      <v-card-text>
        <v-row align="center">
          <v-col cols="6">
            <h2 class="text-h4">AI Video Generator Tool</h2>
            <p class="text-body-2 text-grey-600">Tạo video tự động từ kịch bản với AI</p>
          </v-col>
          <v-col cols="6" class="text-right">
            <v-btn
              color="success"
              size="large"
              prepend-icon="mdi-play"
              variant="elevated"
              :loading="isRunning"
              :disabled="!canRun"
              @click="runFullWorkflow"
            >
              Chạy toàn bộ workflow
            </v-btn>
            <v-btn
              color="orange"
              size="large"
              prepend-icon="mdi-stop"
              variant="outlined"
              class="ml-2"
              :disabled="!isRunning"
              @click="stopWorkflow"
            >
              Dừng
            </v-btn>
          </v-col>
        </v-row>

        <!-- Workflow Status -->
        <v-row v-if="isRunning" class="mt-3">
          <v-col cols="12">
            <v-progress-linear
              :model-value="(workflowStep / 4) * 100"
              color="success"
              height="8"
              class="mb-2"
            ></v-progress-linear>
            <p class="text-body-2 text-center">
              <v-icon size="16" color="success" class="mr-1">mdi-play-circle</v-icon>
              Đang chạy workflow - Bước {{ workflowStep }}/4
            </p>
          </v-col>
        </v-row>

        <!-- Workflow Requirements -->
        <v-row v-if="!canRun && !isRunning" class="mt-2">
          <v-col cols="12">
            <v-alert type="warning" density="compact">
              <v-icon>mdi-alert</v-icon>
              Yêu cầu:
              <span v-if="!script.trim()">Nhập kịch bản • </span>
              <span v-if="!geminiApiKey.trim()">Nhập Gemini API Key • </span>
              <span v-if="!geminiUsage.isConnected">Kết nối Gemini API</span>
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card width="100%">
      <v-card-text>
        <v-row>
          <v-col cols="8">
            <v-text-field
              v-model="voiceId"
              label="Voice ID"
              width="100%"
              variant="outlined"
              type="password"
            />
            <v-text-field
              v-model="apiKey"
              label="ElevenLabs API Key"
              width="100%"
              variant="outlined"
              type="password"
            />
            <v-text-field
              v-model="geminiApiKey"
              label="Gemini API Key"
              width="100%"
              variant="outlined"
              type="password"
              @blur="fetchGeminiUsage"
              :loading="isLoadingUsage"
              :append-inner-icon="
                geminiUsage.isConnected
                  ? 'mdi-check-circle'
                  : 'mdi-alert-circle'
              "
              :color="geminiUsage.isConnected ? 'green' : 'orange'"
            />
          </v-col>
          <v-col cols="4">
            <v-row>
              <v-col cols="6">
                <v-progress-linear
                  :model-value="
                    (geminiUsage.tokensUsed / geminiUsage.dailyLimit) * 100
                  "
                  color="primary"
                  height="20"
                  class="mb-2"
                >
                  <template v-slot:default>
                    <span class="text-caption white--text">
                      {{ geminiUsage.tokensUsed.toLocaleString() }} /
                      {{ geminiUsage.dailyLimit.toLocaleString() }} tokens
                    </span>
                  </template>
                </v-progress-linear>
                <p class="text-caption">Daily Token Usage</p>
              </v-col>
              <v-col cols="6">
                <v-chip
                  :color="geminiUsage.isConnected ? 'green' : 'red'"
                  size="small"
                  prepend-icon="mdi-connection"
                  class="mb-2"
                >
                  {{ geminiUsage.isConnected ? "Connected" : "Disconnected" }}
                </v-chip>
                <br />
                <v-chip
                  :color="
                    geminiUsage.requestsUsed < geminiUsage.requestLimit
                      ? 'green'
                      : 'red'
                  "
                  size="small"
                  class="mb-2"
                >
                  Requests: {{ geminiUsage.requestsUsed }}/{{
                    geminiUsage.requestLimit
                  }}/min
                </v-chip>
                <br />
                <v-chip
                  :color="
                    geminiUsage.tokensUsed < geminiUsage.dailyLimit * 0.8
                      ? 'green'
                      : 'orange'
                  "
                  size="small"
                >
                  {{ geminiUsage.quotaRemaining.toLocaleString() }} tokens
                  remaining
                </v-chip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card
      title="Tạo video từ kịch bản"
      width="100%"
      height="auto"
      style="padding: 20px; margin-top: 1%"
    >
      <v-textarea
        v-model="script"
        clear-icon="mdi-close-circle"
        variant="outlined"
        clearable
        class="scriptInput"
        style="min-height: 40vh"
      ></v-textarea>
      <template v-slot:actions>
        <v-btn
          append-icon="mdi-chevron-right"
          color="red-lighten-2"
          text="Chia kịch bản"
          variant="elevated"
          block
          @click="handleSplitScript()"
        ></v-btn>
      </template>
    </v-card>

    <ActionScript
      v-for="(scriptContent, index) in scriptsResult"
      :key="index"
      :script-content="scriptContent"
      :index="index"
      :api-key="apiKey"
      :voice-id="voiceId"
      :gemini-api-key="geminiApiKey"
      :gemini-usage="geminiUsage"
      @split-script="handleSplitScript"
      @update-gemini-usage="updateGeminiUsage"
    />
  </v-container>
</template>

<style scoped>
.card {
  overflow-y: scroll;
}
</style>
<script setup lang="ts">
import { ref, computed } from "vue";
import { splitScripts } from "./utils/functions";
import ActionScript from "./components/ActionScript.vue";

const script = ref("This is clearable text.");
const scriptsResult = ref<string[]>([]);
const apiKey = ref("");
const voiceId = ref("");
const geminiApiKey = ref("");
const geminiUsage = ref({
  tokensUsed: 0,
  requestsUsed: 0,
  dailyLimit: 1000000, // 1M tokens/day
  requestLimit: 15, // 15 requests/minute
  isConnected: false,
  quotaRemaining: 0,
  quotaTotal: 1000000,
});
const isLoadingUsage = ref(false);
const isRunning = ref(false);
const workflowStep = ref(0);
const workflowAborted = ref(false);

// Computed properties
const canRun = computed(() => {
  return (
    script.value.trim().length > 0 &&
    geminiApiKey.value.trim().length > 0 &&
    geminiUsage.value.isConnected &&
    !isRunning.value
  );
});

const handleSplitScript = () => {
  scriptsResult.value = splitScripts(script.value);
};

const fetchGeminiUsage = async () => {
  if (!geminiApiKey.value) return;

  isLoadingUsage.value = true;
  try {
    // Test API key bằng cách gọi một model list request nhỏ
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    await response.json();

    // Nếu API key hợp lệ, set connected = true
    geminiUsage.value.isConnected = true;

    // Thử fetch quota information (nếu Gemini API support)
    try {
      const quotaResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:countTokens?key=${geminiApiKey.value}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: "test" }],
              },
            ],
          }),
        }
      );

      if (quotaResponse.ok) {
        const quotaData = await quotaResponse.json();
        // Cập nhật quota info nếu có
        console.log("Quota data:", quotaData);
      }
    } catch (quotaError) {
      console.log("Quota check not available:", quotaError);
    }

    // Load saved usage từ localStorage
    const today = new Date().toDateString();
    const savedUsage = localStorage.getItem("geminiUsage");
    const lastUpdate = localStorage.getItem("geminiUsageDate");

    if (savedUsage && lastUpdate === today) {
      const parsed = JSON.parse(savedUsage);
      geminiUsage.value = {
        ...geminiUsage.value,
        ...parsed,
        isConnected: true,
      };
    } else {
      // Reset cho ngày mới
      geminiUsage.value.tokensUsed = 0;
      geminiUsage.value.requestsUsed = 0;
      localStorage.setItem("geminiUsageDate", today);
    }

    console.log("Gemini API connected successfully");
  } catch (error) {
    console.error("Gemini API connection failed:", error);
    geminiUsage.value.isConnected = false;
    alert("Không thể kết nối Gemini API. Vui lòng kiểm tra API key.");
  } finally {
    isLoadingUsage.value = false;
  }
};

const updateGeminiUsage = (usage: {
  inputTokens: number;
  outputTokens: number;
  requests: number;
}) => {
  geminiUsage.value.tokensUsed += usage.inputTokens + usage.outputTokens;
  geminiUsage.value.requestsUsed += usage.requests;
  geminiUsage.value.quotaRemaining = Math.max(
    0,
    geminiUsage.value.quotaTotal - geminiUsage.value.tokensUsed
  );

  // Save to localStorage để persist qua sessions
  localStorage.setItem("geminiUsage", JSON.stringify(geminiUsage.value));
};

const runFullWorkflow = async () => {
  if (!canRun.value) return;

  isRunning.value = true;
  workflowStep.value = 0;
  workflowAborted.value = false;

  try {
    // Step 1: Chia kịch bản
    workflowStep.value = 1;
    console.log("Step 1: Chia kịch bản...");
    handleSplitScript();
    await sleep(1000);

    if (workflowAborted.value) return;

    // Step 2-4: Sẽ được thực hiện tự động bởi ActionScript components
    // Chỉ cần đợi user hoặc tự động trigger
    console.log("Workflow setup complete. ActionScript components sẽ handle remaining steps.");

    alert("Workflow đã bắt đầu! Kịch bản đã được chia. Sử dụng các nút trong từng script để tạo prompts và ảnh.");

  } catch (error) {
    console.error("Workflow error:", error);
    alert(`Lỗi trong workflow: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    isRunning.value = false;
    workflowStep.value = 0;
  }
};

const stopWorkflow = () => {
  workflowAborted.value = true;
  isRunning.value = false;
  workflowStep.value = 0;
  console.log("Workflow stopped by user");
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Load usage từ localStorage khi khởi tạo
const savedUsage = localStorage.getItem("geminiUsage");
if (savedUsage) {
  const parsed = JSON.parse(savedUsage);
  // Reset nếu đã qua ngày mới
  const today = new Date().toDateString();
  const lastUpdate = localStorage.getItem("geminiUsageDate");

  if (lastUpdate !== today) {
    geminiUsage.value.tokensUsed = 0;
    geminiUsage.value.requestsUsed = 0;
    geminiUsage.value.quotaRemaining = geminiUsage.value.quotaTotal;
    localStorage.setItem("geminiUsageDate", today);
  } else {
    geminiUsage.value = { ...geminiUsage.value, ...parsed };
    geminiUsage.value.quotaRemaining = Math.max(
      0,
      geminiUsage.value.quotaTotal - geminiUsage.value.tokensUsed
    );
  }
} else {
  geminiUsage.value.quotaRemaining = geminiUsage.value.quotaTotal;
}
</script>
