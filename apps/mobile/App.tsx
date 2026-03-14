import { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './src/lib/trpc';
import './global.css';

const queryClient = new QueryClient();

export default function App() {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
          async headers() {
            return {
              // optional auth headers
            };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView className="flex-1 bg-slate-50">
          <StatusBar style="auto" />
          <View className="flex-1 justify-center items-center px-6">
            
            <View className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 w-full max-w-sm items-center">
              
              <View className="h-16 w-16 bg-emerald-100 rounded-2xl items-center justify-center mb-6">
                <Text className="text-3xl font-bold text-emerald-600">V</Text>
              </View>
              
              <Text className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">VirujHealth</Text>
              <Text className="text-center text-slate-500 mb-8 leading-relaxed">
                A simple and minimal starter for your modern healthcare SaaS.
              </Text>

              <TouchableOpacity className="w-full bg-emerald-600 active:bg-emerald-700 py-4 rounded-xl items-center shadow-sm">
                <Text className="text-white font-semibold text-base">Connect to Backend</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="w-full mt-2 py-4 rounded-xl items-center">
                <Text className="text-slate-500 font-medium">Continue as Guest</Text>
              </TouchableOpacity>
              
            </View>
            
          </View>
        </SafeAreaView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
