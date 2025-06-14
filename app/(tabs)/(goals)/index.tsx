import * as React from "react";
import { View, ScrollView } from "react-native";
import { Appbar, Card, Button, FAB, Text, ProgressBar, Chip } from "react-native-paper";

export default function GoalsScreen() {
  const goals = [
    {
      title: "React Native 앱 출시",
      dday: "D-90",
      progress: 0.2,
      state: "진행중",
    },
    {
      title: "운동 30일 챌린지",
      dday: "D-12",
      progress: 0.7,
      state: "진행중",
    },
    {
      title: "영어 단어 500개 암기",
      dday: "완료",
      progress: 1,
      state: "완료",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="AI비서" />
        <Appbar.Action icon="bell-outline" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {goals.map((goal, idx) => (
          <Card key={idx} style={{ marginVertical: 8 }}>
            <Card.Title
              title={goal.title}
              subtitle={goal.dday}
              right={() =>
                <Chip
                  mode="outlined"
                  icon={goal.state === "완료" ? "check-circle-outline" : "progress-clock"}
                  style={{
                    backgroundColor: goal.state === "완료" ? "#E0F7FA" : "#F9FBE7",
                    marginRight: 8,
                  }}
                >
                  {goal.state}
                </Chip>
              }
            />
            <Card.Content>
              <ProgressBar progress={goal.progress} style={{ marginTop: 8, height: 8, borderRadius: 8 }} />
              <Text style={{ marginTop: 4 }}>{Math.round(goal.progress * 100)}% 달성</Text>
            </Card.Content>
            <Card.Actions>
              <Button icon="eye-outline" onPress={() => {}}>상세</Button>
              <Button icon="pencil" onPress={() => {}}>편집</Button>
              <Button icon="delete" onPress={() => {}}>삭제</Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 20,
          bottom: 30,
        }}
        label="새 목표"
        onPress={() => {}}
        variant="primary"
      />
    </View>
  );
}