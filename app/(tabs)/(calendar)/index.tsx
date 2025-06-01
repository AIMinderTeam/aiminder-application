import * as React from "react";
import { View, ScrollView } from "react-native";
import { Appbar, Card, Button, FAB, Text, Surface } from "react-native-paper";

export default function CalendarScreen() {
  return (
    <View style={{ flex: 1 }}>
      {/* 상단 Appbar */}
      <Appbar.Header>
        <Appbar.Content title="캘린더" />
        <Appbar.Action icon="bell-outline" onPress={() => {}} />
      </Appbar.Header>

      {/* 월간 달력(모형) */}
      <Surface style={{ margin: 16, padding: 8, borderRadius: 12, elevation: 2 }}>
        <Text variant="titleMedium" style={{ marginBottom: 12 }}>2024년 6월</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Paper의 Surface/Touchable + Text로 달력 칸 예시 */}
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <Text key={d} style={{ width: 40, textAlign: "center", marginHorizontal: 2, fontWeight: "bold" }}>
              {d}
            </Text>
          ))}
        </ScrollView>
        {/* 날짜칸 1주차 예시 */}
        <View style={{ flexDirection: "row", marginTop: 8 }}>
          {[26, 27, 28, 29, 30, 31, 1].map((n, i) => (
            <Button
              key={i}
              mode={n === 1 ? "contained" : "text"}
              style={{ flex: 1, margin: 2, borderRadius: 8 }}
              onPress={() => {}}
              compact
            >
              {n}
            </Button>
          ))}
        </View>
      </Surface>

      {/* 일정 카드 예시 */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <Card style={{ marginVertical: 8 }}>
          <Card.Title title="팀 회의" subtitle="2024-06-01 10:00" left={(props) => <Appbar.Action {...props} icon="account-group-outline" />} />
          <Card.Content>
            <Text variant="bodyMedium">주간 스프린트 회의</Text>
          </Card.Content>
          <Card.Actions>
            <Button icon="pencil" onPress={() => {}}>편집</Button>
            <Button icon="delete" onPress={() => {}}>삭제</Button>
          </Card.Actions>
        </Card>
        {/* 추가 카드들 ... */}
      </ScrollView>

      {/* 플로팅 액션 버튼 */}
      <FAB
        icon="plus"
        style={{
          position: "absolute",
          right: 20,
          bottom: 30,
        }}
        label="새 일정"
        onPress={() => {}}
        variant="primary"
      />
    </View>
  );
}