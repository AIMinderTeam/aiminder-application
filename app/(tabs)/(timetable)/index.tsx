import * as React from "react";
import { View, ScrollView } from "react-native";
import { Appbar, Card, Button, FAB, Text, ProgressBar } from "react-native-paper";

export default function TimetableScreen() {
  const [progress, setProgress] = React.useState(0.5);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="타임테이블" />
        <Appbar.Action icon="calendar" onPress={() => {}} />
      </Appbar.Header>

      <Card style={{ margin: 16, borderRadius: 12 }}>
        <Card.Title title="2024-06-02 (일)" />
        <Card.Content>
          <Text variant="bodyMedium">오늘의 일정 진행률</Text>
          <ProgressBar progress={progress} style={{ marginTop: 8, height: 8, borderRadius: 8 }} />
          <Text style={{ marginTop: 4 }}>{Math.round(progress * 100)}%</Text>
        </Card.Content>
      </Card>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <Card style={{ marginVertical: 8 }}>
          <Card.Title title="10:00 - 11:00" subtitle="업무 집중" left={(props) => <Appbar.Action {...props} icon="briefcase-outline" />} />
          <Card.Content>
            <Text>기획안 작성 및 피드백</Text>
          </Card.Content>
          <Card.Actions>
            <Button icon="check" onPress={() => setProgress(Math.min(1, progress + 0.2))}>완료</Button>
            <Button icon="pencil" onPress={() => {}}>편집</Button>
          </Card.Actions>
        </Card>
        <Card style={{ marginVertical: 8 }}>
          <Card.Title title="14:00 - 15:00" subtitle="자기계발" left={(props) => <Appbar.Action {...props} icon="book-outline" />} />
          <Card.Content>
            <Text>React Native 공부</Text>
          </Card.Content>
          <Card.Actions>
            <Button icon="check" onPress={() => setProgress(Math.min(1, progress + 0.2))}>완료</Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 20,
          bottom: 30,
        }}
        label="새 블록"
        onPress={() => {}}
        variant="primary"
      />
    </View>
  );
}